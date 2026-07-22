import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';

import {
  CommonModule,
} from '@angular/common';

import {
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';

import {
  MatPaginator,
  MatPaginatorModule,
} from '@angular/material/paginator';

import {
  MatSort,
  MatSortModule,
} from '@angular/material/sort';

export interface DataTableColumn {

  key: string;

  header: string;

  sortable?: boolean;

  cellTemplate?: TemplateRef<any>;
}

@Component({
  selector: 'app-data-table',

  standalone: true,

  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],

  templateUrl: './data-table.html',

  styleUrl: './data-table.scss',
})
export class DataTableComponent
  implements OnChanges, AfterViewInit
{
  @Input()
  data: any[] = [];

  @Input()
  columns: DataTableColumn[] = [];

  @Input()
  pageSize = 10;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  dataSource =
    new MatTableDataSource<any>();

  ngOnChanges(
    changes: SimpleChanges
  ): void {

    if (
      changes['data']
    ) {

      this.dataSource.data =
        this.data;
    }
  }

  ngAfterViewInit(): void {

    this.dataSource.paginator =
      this.paginator;

    this.dataSource.sort =
      this.sort;
  }

  get displayedColumns(): string[] {

    return this.columns.map(
      column => column.key
    );
  }
}