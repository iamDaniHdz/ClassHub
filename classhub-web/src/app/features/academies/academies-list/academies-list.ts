import { Component, OnInit, inject } from '@angular/core';

import { AppHeaderComponent } from '../../../components/app-header/app-header';
import { AcademiesService } from '../services/academies.service';
import { MATERIAL_IMPORTS } from '../../../shared/material/material';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-academies-list',
  standalone: true,
  imports: [
    AppHeaderComponent,
    CommonModule,
    ...MATERIAL_IMPORTS
  ],
  templateUrl: './academies-list.html',
  styleUrl: './academies-list.scss',
})
export class AcademiesListComponent implements OnInit {

  private readonly academiesService =
    inject(AcademiesService);

  dataSource = new MatTableDataSource<any>([]);

  displayedColumns: string[] = [
    'academy',
    'classroom',
    'students',
    'teacher',
    'actions',
  ];

  ngOnInit(): void {

  this.academiesService
    .getAcademies()    
    .subscribe((response: any) => {

        this.dataSource.data =
          response.data;
      });

  }
}