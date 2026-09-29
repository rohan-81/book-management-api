from django.contrib.messages import error
from django.core import serializers
from django.core.serializers import serialize
from django.shortcuts import render,redirect
from .serializers import *
from .models import *
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


# Create your views here.

class AuthorListCreateView(APIView):
    def get (self,request):
        authors=Author.objects.all()
        serializer=AuthorSerializer(authors,many=True)
        return Response (serializer.data)

    def post(self,request):
        serializer=AuthorSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)  

class BookListCreateView(APIView):
    def get (self,request):
        books=Book.objects.all()
        serializer=BookSerializer(books,many=True)
        return Response (serializer.data)

    def post(self,request):
        serializer=BookSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)  

class BookDetailView(APIView):

    def get_object(self, pk):
        try:
            return Book.objects.get(pk=pk)
        except Book.DoesNotExist:
            return None

    def get(self, request, pk):
        book = self.get_object(pk)

        if book is None:
            return Response(
                {"detail": "Book not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = BookSerializer(book)

        return Response(serializer.data)

    def put(self, request, pk):
        book = self.get_object(pk)

        if book is None:
            return Response(
                {"detail": "Book not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = BookSerializer(
            book,
            data=request.data
        )

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def patch(self, request, pk):
        book = self.get_object(pk)

        if book is None:
            return Response(
                {"detail": "Book not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = BookSerializer(
            book,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, pk):
        book = self.get_object(pk)

        if book is None:
            return Response(
                {"detail": "Book not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        book.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )

