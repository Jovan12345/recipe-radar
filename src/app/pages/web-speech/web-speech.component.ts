import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, Subject, merge, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';

import { ChatService } from '../../shared/services/chat-service/chat-service';
import { FormControl } from '@angular/forms';
import { SpeechError } from '../../shared/model/speech-error';
import { SpeechEvent } from '../../shared/model/speech-event';
import { SpeechNotification } from '../../shared/model/speech-notification';
import { SpeechRecognizerService } from '../../shared/services/web-apis/speech-recognizer.service';
import { SupabaseService } from '../../shared/services/supabase/supabase.service';

@Component({
  selector: 'wsa-web-speech',
  templateUrl: './web-speech.component.html',
  styleUrls: ['./web-speech.component.scss'],
})
export class WebSpeechComponent implements OnInit {
  currentLanguage = 'en-US';
  totalTranscript?: string | null;

  transcript?: string | null;
  listening$!: Observable<boolean>;
  errorMessage$?: Observable<string>;
  defaultError$ = new Subject<string | undefined>();

  shoppingItems: { id: number, ingredient_name: string; quantity: number; unit: string }[] =
    [];
  recipeResults: any[] = [];

  inputSearchValue = new FormControl('');

  constructor(
    private speechRecognizer: SpeechRecognizerService,
    private chatService: ChatService,
    private supabaseService: SupabaseService
  ) {
    this.inputSearchValue.valueChanges
      .pipe(debounceTime(600), distinctUntilChanged())
      .subscribe((data) => {
        this.transcript = data;
        this.totalTranscript = data;
      });
  }

  ngOnInit(): void {
    const webSpeechReady = this.speechRecognizer.initialize(
      this.currentLanguage
    );
    if (webSpeechReady) {
      this.initRecognition();
    } else {
      this.errorMessage$ = of(
        'Your Browser is not supported. Please try Google Chrome.'
      );
    }
    this.loadShoppingList();
  }

  start(): void {
    if (this.speechRecognizer.isListening) {
      this.stop();
      return;
    }

    this.defaultError$.next(undefined);
    this.speechRecognizer.start();
  }

  stop(): void {
    this.speechRecognizer.stop();
  }

  private initRecognition(): void {
    this.speechRecognizer
      .onResult()
      .pipe(
        tap((notification) => {
          this.processNotification(notification);
        })
      )
      .subscribe((notification) => {
        this.transcript = notification.content;
        if (notification.content) {
          this.inputSearchValue.setValue(notification.content);
        }
      });

    this.listening$ = merge(
      this.speechRecognizer.onStart(),
      this.speechRecognizer.onEnd()
    ).pipe(
      map((notification) => {
        return notification.event === SpeechEvent.Start;
      })
    );

    this.errorMessage$ = merge(
      this.speechRecognizer.onError(),
      this.defaultError$
    ).pipe(
      map((data) => {
        if (data === undefined) {
          return '';
        }
        if (typeof data === 'string') {
          return data;
        }
        let message;
        switch (data.error) {
          case SpeechError.NotAllowed:
            message = `Cannot run the demo.
            Your browser is not authorized to access your microphone.
            Verify that your browser has access to your microphone and try again.`;
            break;
          case SpeechError.NoSpeech:
            message = `No speech has been detected. Please try again.`;
            break;
          case SpeechError.AudioCapture:
            message = `Microphone is not available. Plese verify the connection of your microphone and try again.`;
            break;
          default:
            message = '';
            break;
        }
        return message;
      })
    );
  }

  private processNotification(notification: SpeechNotification<string>): void {
    if (notification.event === SpeechEvent.FinalContent) {
      this.totalTranscript = notification.content;
      this.speechRecognizer.stop();
      if (this.totalTranscript) {
        this.inputSearchValue.setValue(this.totalTranscript);
      }
    }
  }

  processInput(): void {
    const userInput = this.inputSearchValue.value || this.totalTranscript;
    if (!userInput) return;

    this.chatService.sendToGPT(userInput).subscribe(async (response) => {
      const { action, sql, params } = response;

      if (action === 'fetch_recipes' && sql) {
        const cleanedSQL = sql
          .replace(/```sql|```/gi, '')
          .replace(/;$/, '')
          .replace(/\n/g, ' ')
          .trim();

        try {
          const rows = await this.supabaseService.executeSQL(cleanedSQL);
          this.recipeResults = rows;
        } catch (err) {
          console.error('SQL execution error:', err);
        }
      } else if (action === 'add_items' && Array.isArray(params)) {
        for (const item of params) {
          await this.supabaseService.addToShoppingList(item);
        }
        this.loadShoppingList();
        console.log('Items added to shopping list!');
      } else if (action === 'delete_items' && Array.isArray(params)) {
        for (const item of params) {
          await this.supabaseService.deleteItemByIngredient(item.ingredient_name);
        }
        await this.loadShoppingList();
        console.log('Items deleted from shopping list!');
      } else {
        console.warn('Unrecognized or incomplete GPT response:', response);
      }
    });
  }

  private async loadShoppingList() {
    this.shoppingItems = await this.supabaseService.fetchShoppingList();
  }

  onShoppingListUpdate(
    updatedItems: { id: number, ingredient_name: string; quantity: number; unit: string }[]
  ): void {
    this.shoppingItems = [...updatedItems];
  }

  get showCheckIcon(): boolean {
    return !this.speechRecognizer.isListening && !!this.inputSearchValue.value;
  }
}
