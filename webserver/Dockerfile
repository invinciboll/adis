FROM ubuntu

USER root

RUN apt-get install -y apt-transport-https
RUN apt-get -y update && apt-get -y upgrade

# Install the webserver
RUN apt-get install -y apache2

# Get rid of the ServerName warning
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Install JDK 11
RUN apt-get install -y default-jdk

# The following lines are from this source: https://stackoverflow.com/questions/53079135/how-can-i-pass-arguments-or-bypass-it-in-docker-build-process
# They prevent the php-module installation from being interactive, this is needed since the requested userinputs break the docker build process
### Make abt noninteractive
ENV DEBIAN_FRONTEND noninteractive
ENV DEBCONF_NONINTERACTIVE_SEEN true
### Preesed tzdata, update package index, upgrade packages and install needed software
RUN echo "tzdata tzdata/Areas select Europe" > /tmp/preseed.txt; \
    echo "tzdata tzdata/Zones/Europe select Berlin" >> /tmp/preseed.txt; \
    debconf-set-selections /tmp/preseed.txt && \
    apt-get update && \
    apt-get install -y tzdata

# Install php module. No symbolic link needed to enable mod_php, since it gets automatically enabled after installation
RUN apt-get install -y libapache2-mod-php8.1

# Create symbolic link to enable mod_cgi
RUN ln -s /etc/apache2/mods-available/cgi.load /etc/apache2/mods-enabled/

# Copy cgi scripts into container and make it executable
COPY hello.cgi /usr/lib/cgi-bin/
RUN chmod +x /usr/lib/cgi-bin/hello.cgi

# Start the webserver on container startup
# Explanation why to use FOREGROUND: https://stackoverflow.com/questions/44376852/how-to-start-apache2-automatically-in-a-ubuntu-docker-container
CMD apachectl -D FOREGROUND
