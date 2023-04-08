import { CdkDropList } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { filter, map, Observable, tap } from 'rxjs';
import { ExerciseItem, ExerciseItemsGQL, ExerciseItemsQuery } from '../../../generated/graphql.generated';
import { FixedFilterComponent } from '../../shared/fixed-filter/fixed-filter.component';
import { notEmpty } from '../../shared/utils';

@Component({
  selector: 'app-exercise-items',
  templateUrl: './exercise-items.component.html',
  styleUrls: ['./exercise-items.component.scss']
})
export class ExerciseItemsComponent implements OnInit {

  @Input() cdkDroplistConnectedTo!: CdkDropList | string;

  @Input() placeholderSetsHidden = false;

  @ViewChild(FixedFilterComponent) fixedFilter?: FixedFilterComponent<ExerciseItem>;

  loading = false;

  constructor(
    private exerciseItemsGQL: ExerciseItemsGQL,
  ) {};

  filter = '';

  dragging = false;

  placeholderRefresing = false;

  exerciseItems$!: Observable<ExerciseItem[]>;

  filteredExercises: ExerciseItem[] = [];

  ngOnInit(): void {
    this.exerciseItems$ = this.exerciseItemsGQL.watch().valueChanges
      .pipe(
        tap((res) => this.loading = res.loading),
        filter(res => Boolean(res.data) && Boolean(res.data.exerciseItems)),
        map((res: ApolloQueryResult<ExerciseItemsQuery>) => {
          const exerciseItems = res.data.exerciseItems.filter(notEmpty);
          return exerciseItems;
        }),
      )
    ;
  };

  setFilteredExercises(filteredExercises: ExerciseItem[]) {
    this.filteredExercises = filteredExercises;
  }

  hide() {
    if (!this.fixedFilter) { return; }
    this.fixedFilter.hide();
  }

  show() {
    if (!this.fixedFilter) { return; }
    this.fixedFilter.show();
  }

}
