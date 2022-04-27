FROM ubuntu

USER root

RUN apt-get install -y apt-transport-https
RUN apt-get -y update && apt-get -y upgrade
RUN apt-get install -y apache2

# Explanation why to use FOREGROUND: 
# https://stackoverflow.com/questions/44376852/how-to-start-apache2-automatically-in-a-ubuntu-docker-container
CMD apachectl -D FOREGROUND
