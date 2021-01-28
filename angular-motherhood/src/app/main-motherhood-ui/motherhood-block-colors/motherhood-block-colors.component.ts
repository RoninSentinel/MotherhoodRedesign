import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { contrastingColor } from 'src/app/helpers/contrast-color.helper';
import { hexToRgb } from 'src/app/helpers/hex-to-rgb.helper';

import { BlockCategoryModel } from 'src/app/model-types';
import { BlockCategoryService } from 'src/app/services/block-category.service';

@Component({
  selector: 'motherhood-block-colors',
  templateUrl: 'motherhood-block-colors.component.html',
  styleUrls: ['./motherhood-block-colors.component.css'],
})
export class MotherhoodBlockColorsComponent implements OnInit {

    blockCategories: BlockCategoryModel[];
    private _blockCategorySubscription;

    currentSquadron: string;
    isLoading: boolean;

    @Output() newBlockCategorySelectedEvent = new EventEmitter<BlockCategoryModel>();

    @Input() editMode: boolean;

    constructor(
      private route: ActivatedRoute,
      private blockCategoryService: BlockCategoryService,
    ){}

    ngOnInit(): void {
      this.currentSquadron = this.route.snapshot.paramMap.get('squadron');

      this.isLoading = true;
      this.blockCategoryService.setFilter(this.currentSquadron);

      this._blockCategorySubscription = this.blockCategoryService.blockCategories$.subscribe(data => {
        this.blockCategories = data;
        this.isLoading = false;
      });

    }

    ngOnDestroy() {
      this._blockCategorySubscription.unsubscribe();
    }

    blockCategoryButtonClicked(blockCategory: BlockCategoryModel) {
      this.newBlockCategorySelectedEvent.emit(blockCategory);
    }

    getButtonBackgroundColor(blockCategory: BlockCategoryModel): string {
        return blockCategory.color;
    }

    getPreferredTextColor(blockCategory: BlockCategoryModel): string {
        let currentColor = hexToRgb(blockCategory.color);
        return (contrastingColor(currentColor));
    }

}