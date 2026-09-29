from serializers import BookSerializer
from django.core import serializers
from django.core import serializers
from django.core import serializers
from django.core import serializers
from django.core import serializers
from django.core import serializers
from serializers import AuthorSerializer
from aiofiles import base
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
        serializer=AuthorSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)  
        


