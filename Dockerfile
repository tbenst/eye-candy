FROM python:3.5-alpine
ADD . /www
WORKDIR /www
RUN pip install -r requirements.txt
