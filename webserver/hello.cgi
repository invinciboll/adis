#!/usr/bin/java --source 11

class HelloWorld {
    public static void main(String[] args) {
        System.out.print("Content-Type: text/html\r\n\r\n");

        System.out.println("<!DOCTYPE html>");
        System.out.println("<html>");
        System.out.println("  <head>");
        System.out.println("    <title>Hello!</title>");
        System.out.println("  </head>");
        System.out.println("  <body>");
        System.out.println("    <p>Hello World!</p>");
        System.out.println("  </body>");
        System.out.println("</html>");
    }
}

