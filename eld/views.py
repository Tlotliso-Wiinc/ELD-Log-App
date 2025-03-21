from django.shortcuts import render
import os

def index(request):
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    return render(request, BASE_DIR + '/frontend/build/client/index.html')