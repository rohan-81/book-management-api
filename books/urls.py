from books.views import BookDetailView
from django.urls import path
from .views import *


urlpatterns = [
    path("authors/",AuthorListCreateView.as_view()),
    path("books/",BookListCreateView.as_view()),
    path("books/<int:pk>",BookDetailView.as_view()),
]