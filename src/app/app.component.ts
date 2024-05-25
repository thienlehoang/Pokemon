import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'pokemon';
  listData: any = [];
  showPopup: boolean = false;
  showItem: any = {};
  image: any;
  detail: any = {
    sortValue: '',
    sortOrder: '',
    filterValue: '',
  };
  sortOptions: Array<any> = [
    {
      label: '-----Select-----',
      value: '',
    },
    {
      label: 'Sort by number Asc',
      value: 'number',
    },
    {
      label: 'Sort by total',
      value: 'total',
    },
    {
      label: 'Sort by hp',
      value: 'hp',
    },
    {
      label: 'Sort by attack',
      value: 'attack',
    },
    {
      label: 'Sort by defense',
      value: 'defense',
    },
    {
      label: 'Sort by sp_atk',
      value: 'sp_atk',
    },
    {
      label: 'Sort by sp_def',
      value: 'sp_def',
    },
    {
      label: 'Sort by speed',
      value: 'speed',
    },
  ];
  sortOrders: Array<any> = [
    {
      label: 'From small to large/ Asc',
      value: 'az',
    },
    {
      label: 'From large to small/ Desc',
      value: 'za',
    },
  ];
  filterOptions: Array<any> = [];
  isLoading: any = true;
  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    this.getTypeOptions();
    this.getData();
  }
  async getData() {
    this.isLoading = true;
    let inputSort =
      (this.detail.sortOrder == 'za' ? '-' : '') + this.detail.sortValue;
    try {
      await this.http
        .get(
          `https://api.vandvietnam.com/api/pokemon-api/pokemons?
          ${
            (this.detail.filterValue != ''
              ? 'filter[type]=' + this.detail.filterValue + '&'
              : '') + (inputSort != '' ? 'sort=' + inputSort : '')
          }`
        )
        .pipe()
        .subscribe((res: any) => {
          this.listData = res.data;
          this.isLoading = false;
        });
    } catch (err) {
      console.log(err);
      this.isLoading = false;
    }
  }

  async getTypeOptions() {
    this.isLoading = true;
    try {
      await this.http
        .get('https://api.vandvietnam.com/api/pokemon-api/types')
        .pipe()
        .subscribe((res: any) => {
          this.filterOptions = res.data;
          this.isLoading = false;
        });
    } catch (err) {
      console.log(err);
      this.isLoading = false;
    } finally {
    }
  }
  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        this.image = reader.result;
      },
      false
    );

    if (image) {
      reader.readAsDataURL(image);
    }
  }
  async getImage(id: any) {
    this.isLoading = true;
    try {
      await this.http
        .get(
          `https://api.vandvietnam.com/api/pokemon-api/pokemons/${id}/sprite`,
          { responseType: 'blob' }
        )
        .subscribe((data) => {
          this.createImageFromBlob(data);
          this.isLoading = false;
        });
    } catch (err) {
      console.log(err);
      this.isLoading = false;
    }
  }
  async getItem(id: any) {
    this.isLoading = true;
    try {
      await this.http
        .get(`https://api.vandvietnam.com/api/pokemon-api/pokemons/${id}`)
        .pipe()
        .subscribe((res: any) => {
          this.showItem = res.data;
          this.isLoading = false;
        });
    } catch (err) {
      console.log(err);
      this.isLoading = false;
    }
  }
  onChange(event: any, key: string = '') {
    this.detail[key] = event.target.value;
    this.getData();
  }
  showInfo(item: any, value: boolean) {
    this.showPopup = value;
    this.getItem(item.id);
    this.getImage(item.id);
  }
  closeInfo() {
    this.showPopup = false;
    this.showItem = {};
  }
}
