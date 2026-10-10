from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Avg, Count

from .models import Author, Book
from .serializers import AuthorSerializer, BookSerializer


class AuthorViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Authors with full CRUD:
    - GET /api/authors/
    - POST /api/authors/
    - GET /api/authors/{id}/
    - PUT /api/authors/{id}/
    - PATCH /api/authors/{id}/
    - DELETE /api/authors/{id}/
    - GET /api/authors/{id}/books/ (Custom action: all books by this author)
    """
    queryset = Author.objects.annotate(book_count=Count('books')).order_by('name')
    serializer_class = AuthorSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'email']
    ordering_fields = ['id', 'name']

    @action(detail=True, methods=['get'])
    def books(self, request, pk=None):
        """Get all books written by this author."""
        author = self.get_object()
        books = author.books.all()
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)


class BookViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Books with full CRUD:
    - GET /api/books/
    - POST /api/books/
    - GET /api/books/{id}/
    - PUT /api/books/{id}/
    - PATCH /api/books/{id}/
    - DELETE /api/books/{id}/
    - POST /api/books/{id}/toggle-availability/ (Toggle book status)
    - GET /api/books/stats/ (Summary statistics)
    """
    queryset = Book.objects.select_related('author').all()
    serializer_class = BookSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'author__name']
    ordering_fields = ['price', 'created_at', 'title', 'published_date']
    ordering = ['-created_at']

    def get_queryset(self):
        """Support filtering by author ID and availability status."""
        queryset = super().get_queryset()
        author_id = self.request.query_params.get('author')
        available = self.request.query_params.get('available')

        if author_id and author_id.isdigit():
            queryset = queryset.filter(author_id=int(author_id))

        if available is not None:
            if available.lower() in ['true', '1']:
                queryset = queryset.filter(available=True)
            elif available.lower() in ['false', '0']:
                queryset = queryset.filter(available=False)

        return queryset

    @action(detail=True, methods=['post', 'patch'], url_path='toggle-availability')
    def toggle_availability(self, request, pk=None):
        """Toggle availability of a book."""
        book = self.get_object()
        book.available = not book.available
        book.save()
        serializer = self.get_serializer(book)
        return Response({
            'message': f'Book "{book.title}" availability toggled to {book.available}.',
            'book': serializer.data
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='stats')
    def stats(self, request):
        """Return library overview statistics."""
        total_books = Book.objects.count()
        available_books = Book.objects.filter(available=True).count()
        total_authors = Author.objects.count()
        avg_price_data = Book.objects.aggregate(avg_price=Avg('price'))
        avg_price = avg_price_data['avg_price'] or 0.00

        return Response({
            'total_books': total_books,
            'available_books': available_books,
            'out_of_stock_books': total_books - available_books,
            'total_authors': total_authors,
            'avg_price': round(float(avg_price), 2)
        })