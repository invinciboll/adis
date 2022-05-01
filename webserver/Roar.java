package webserver;

public class Roar {
    private String author;
    private String message;
    private String dateTime;

    public Roar(String author, String message, String dateTime){
        this.author = author;
        this.message = message;
        this.dateTime = dateTime;
    }

    public String getAuthor(){
        return author;
    }

    public String getMessage(){
        return message;
    }

    public String getDateTime(){
        return dateTime;
    }
}