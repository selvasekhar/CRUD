import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  freshnessList = ["Brand New", "second Half", "Reference"];
  productForm !: FormGroup;
  actionbtn: string = "save"
  // constructor(private formBuilder : FormBuilder) { }
  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogref: MatDialogRef<DialogComponent>) {
  }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      freshness: ['', Validators.required],
      price: ['', Validators.required],
      comment: ['', Validators.required],
      date: ['', Validators.required],
    });
    console.log(this.editData);
    if (this.editData) {
      this.actionbtn = "Update"
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['date'].setValue(this.editData.date);
      this.productForm.controls['freshness'].setValue(this.editData.freshness);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['comment'].setValue(this.editData.comment);
      // t  his.productForm.controls['action'].setValue(this.editData.productName);

    }
  }


  addproduct() {
    // console.log(this.productForm.value);
    if (!this.editData) {
      if (this.productForm.valid) {
        this.api.postProduct(this.productForm.value)
          .subscribe({
            next: (res) => {
              alert("product added successfully")
              this.productForm.reset();
              this.dialogref.close('save');
            },
            error: () => {
              alert("Error while added this product")
            }
          })
      }
    } else {
      this.updateproduct()
    }
  }
  updateproduct() {
    this.api.putProduct(this.productForm.value, this.editData.id)
      .subscribe({
        next:(res)=>{
          // console.log(res);
          alert("product update successfully");
          this.productForm.reset();
          this.dialogref.close('update');
        },

        error: () => {
          alert("Error while update this Records");
        }
      });

  }
}


