from django import forms
from .models import Book, Author


class AuthorForm(forms.ModelForm):
    class Meta:
        model = Author
        fields = ['name', 'email']
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'Enter author full name',
                'required': True,
                'id': 'id_author_name'
            }),
            'email': forms.EmailInput(attrs={
                'class': 'form-input',
                'placeholder': 'author@example.com',
                'required': True,
                'id': 'id_author_email'
            }),
        }


class BookForm(forms.ModelForm):
    class Meta:
        model = Book
        fields = ['title', 'description', 'price', 'published_date', 'author', 'available']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'Enter book title (e.g. Clean Code)',
                'required': True,
                'id': 'id_book_title'
            }),
            'description': forms.Textarea(attrs={
                'class': 'form-textarea',
                'placeholder': 'Provide a synopsis or description of the book...',
                'rows': 4,
                'id': 'id_book_description'
            }),
            'price': forms.NumberInput(attrs={
                'class': 'form-input',
                'placeholder': '0.00',
                'step': '0.01',
                'min': '0',
                'required': True,
                'id': 'id_book_price'
            }),
            'published_date': forms.DateInput(attrs={
                'class': 'form-input',
                'type': 'date',
                'required': True,
                'id': 'id_book_published_date'
            }),
            'author': forms.Select(attrs={
                'class': 'form-select',
                'required': True,
                'id': 'id_book_author'
            }),
            'available': forms.CheckboxInput(attrs={
                'class': 'form-checkbox',
                'id': 'id_book_available'
            }),
        }
