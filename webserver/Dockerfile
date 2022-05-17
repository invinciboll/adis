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
    apt-get install -y tzdata

# Set timezone
RUN ln -fs /usr/share/zoneinfo/Europe/Berlin /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata

# Install php module. No symbolic link needed to enable mod_php, since it gets automatically enabled after installation
RUN apt-get install -y libapache2-mod-php8.1

# Create symbolic link to enable mod_cgi
RUN ln -s /etc/apache2/mods-available/cgi.load /etc/apache2/mods-enabled/

# Copy templates and csv data into corresponding folders
COPY /html/* /usr/lib/cgi-bin/html/
COPY /data/* /usr/lib/cgi-bin/data/

# Copy java code, cgi script, php into container, append java code to cgi and make it executable
COPY Roary.java /usr/lib/cgi-bin/
COPY task2.cgi /usr/lib/cgi-bin/
COPY task3.php /usr/lib/cgi-bin/
COPY getRoarys.php /usr/lib/cgi-bin/
COPY login.php /usr/lib/cgi-bin/
COPY register.php /usr/lib/cgi-bin/

# Append java code to cgi and make it executabl
RUN cat /usr/lib/cgi-bin/Roary.java >> /usr/lib/cgi-bin/task2.cgi
RUN chmod +x /usr/lib/cgi-bin/task2.cgi

# Install SQLite to container
RUN apt-get install -y sqlite3 libsqlite3-dev
# Install sqlite extension to php
RUN apt install php8.1-sqlite3
RUN mkdir /var/www/data
RUN chown -R www-data:www-data /var/www/data
RUN chmod -R 770 /var/www/data
# Copy db test script into container
COPY test-db.php /usr/lib/cgi-bin/

# Start the webserver on container startup
# Explanation why to use FOREGROUND: https://stackoverflow.com/questions/44376852/how-to-start-apache2-automatically-in-a-ubuntu-docker-container
CMD apachectl -D FOREGROUND
