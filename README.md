# How to run?
Run ```docker-compose up --build``` in the ADIS folder.

Task 1 documentation is inline in the Dockerfile.

Task 2 is available under: ```http://localhost/cgi-bin/task2.cgi```.

Task 3 is available under: ```http://localhost/cgi-bin/task3.php```.

# Known bugs
The Timestamp by creating roars is UTC time, not UTC+2. We tried to fix it by setting the container timezone to UTC+2. The container shows the correct time when executing ```date``` in the terminal, but the cgi scripts still pull the wrong time.