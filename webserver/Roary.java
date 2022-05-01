package webserver;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Roary {
    static String readTemplate(String fileName){
        try(BufferedReader br = new BufferedReader(new FileReader(fileName))) {
            StringBuilder sb = new StringBuilder();
            String line = br.readLine();

            while (line != null) {
                sb.append(line);
                sb.append(System.lineSeparator());
                line = br.readLine();
            }
        String content = sb.toString();
        return content;
        } catch (IOException exception){
            return exception.toString();
        }
    } 
    
    static List<Roar> loadRoars(String fileName){
        List<Roar> roars = new ArrayList<Roar>();
        try(BufferedReader br = new BufferedReader(new FileReader(fileName))) {
            StringBuilder sb = new StringBuilder();
            String line = br.readLine();
            while (line != null) {
                sb.append(line);
                sb.append(System.lineSeparator());
                String[] linePieces= line.split(",");
                Roar roar = new Roar(linePieces[0], linePieces[1], linePieces[2]);
                roars.add(roar);
                line = br.readLine();
            }
        return roars;

        } catch (IOException ioe){
            return roars;
        }
    }

    static String generateHtmlFromRoars(List<Roar> roars){
        String htmlOutput = "";
        for(Roar roar : roars){
            htmlOutput += ("<div class='container'><div class='card' style='width: 100%''><div class='card-body'><h5 class='card-title'>" + roar.getAuthor() + "</h5><p class='card-text'>" + roar.getMessage() +"</p><h6 class='card-subtitle mb-2 text-muted'>"+ roar.getDateTime() +"</h6></div></div></div>");
        }
        return htmlOutput;
    }

    static void addNewRoar(){    
        try(BufferedReader br = new BufferedReader(new InputStreamReader(System.in))) {
            StringBuilder sb = new StringBuilder();
            String line = br.readLine();

            while (line != null) {
                sb.append(line);
                sb.append(System.lineSeparator());
                line = br.readLine();
            }
        String data = sb.toString();

        String[] strings = data.split("&");
        String name = "";
        String message = "";
        String[] namePair = strings[0].split("=");
        if (namePair[0].equals("name")){
            name = namePair[1];
        }
        String[] msgPair = strings[1].split("=");
        if (msgPair[0].equals("message")){
            try {
                message = java.net.URLDecoder.decode(msgPair[1], StandardCharsets.UTF_8.name()).replace("\n", " ").replace("\r", " ");
            } catch (UnsupportedEncodingException e) {
                // not going to happen - value came from JDK's own StandardCharsets
            }
        }
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        Roar roar = new Roar(name, message, (LocalDateTime.now().format(formatter).replace("\n", "").replace("\r", "")));

        BufferedWriter writer = new BufferedWriter(new FileWriter("data/roars.csv", true));
        writer.append('\n');
        writer.append(roar.getAuthor() + "," + roar.getMessage() + "," + roar.getDateTime());
        writer.close();

        } catch (IOException ioe) {
            System.out.println(ioe);
        }
    }
    public static void main(String[] args) {
        String htmlUpper = readTemplate("html/template-upper.html");
        String htmlLower = readTemplate("html/template-lower.html");

        String method = System.getenv("REQUEST_METHOD");
        if (method.equals("POST")){
            addNewRoar();
        }

        List<Roar> allRoars = loadRoars("data/roars.csv");
        Collections.sort(allRoars, (Roar r1, Roar r2) -> r2.getDateTime().compareTo(r1.getDateTime()));
        String roarsHtml = generateHtmlFromRoars(allRoars);

        System.out.print("Content-Type: text/html\r\n\r\n");
        System.out.println(htmlUpper);
        System.out.println(roarsHtml);
        System.out.println(htmlLower);
    }
}

class Roar {
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
