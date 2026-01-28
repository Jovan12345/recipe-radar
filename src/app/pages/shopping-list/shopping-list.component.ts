import { Component, EventEmitter, Input, Output } from '@angular/core';

import { SupabaseService } from '../../shared/services/supabase/supabase.service';

interface ShoppingRow {
  id?: number;
  ingredient_name: string;
  quantity: number | null;
  unit: string;
}

@Component({
  selector: 'shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent {
  @Input() items: { id: number, ingredient_name: string; quantity: number; unit: string }[] = [];
  @Output() update = new EventEmitter<any[]>();

  displayedColumns: string[] = ['ingredient_name', 'quantity', 'unit', 'actions'];
  newItem: ShoppingRow = { ingredient_name: '', quantity: null, unit: '' };

  constructor(private supabaseService: SupabaseService) {}

  /* ---------- DELETE ---------- */
  async removeItem(item: any, index: number): Promise<void> {
    const confirmed = confirm(`Remove ingredient "${item.ingredient_name}"?`);
    if (!confirmed) return;

    const success = await this.supabaseService.deleteShoppingItem(item.id);
    if (success) {
      this.items.splice(index, 1);
      this.update.emit([...this.items]);
    }
  }

    /* ---------- ADD ---------- */
  isNewItemValid(): boolean {
    return !!this.newItem.ingredient_name
        && !!this.newItem.unit
        && this.newItem.quantity != null && this.newItem.quantity > 0;
  }

  async saveItem() {
    if (!this.isNewItemValid()) return;

    // call your RPC or direct insert
    const saved = await this.supabaseService.addToShoppingList({
      ingredient_name: this.newItem.ingredient_name,
      quantity       : this.newItem.quantity!,
      unit           : this.newItem.unit
    });

    if (saved) {
      // Supabase returns the inserted row with id – push it into the table
      await this.loadShoppingList();
      this.update.emit([...this.items]);

      // reset inputs
      this.newItem = { ingredient_name: '', quantity: null, unit: '' };
    }
  }

  private async loadShoppingList() {
    this.items = await this.supabaseService.fetchShoppingList();
  }

}
