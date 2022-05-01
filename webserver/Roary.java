package webserver;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
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
    
    static List<List<String>> loadRoars(String fileName){
        List<List<String>> data = new ArrayList<List<String>>();
        try(BufferedReader br = new BufferedReader(new FileReader(fileName))) {
            StringBuilder sb = new StringBuilder();
            String line = br.readLine();
            roar = new Roar("test","","");
            while (line != null) {
                sb.append(line);
                sb.append(System.lineSeparator());
                String[] linePieces= line.split(",");
                List<String> csvPieces = new ArrayList<String>(linePieces.length);
                for(String piece : linePieces)
                {
                    csvPieces.add(piece);
                }
                data.add(csvPieces);
                line = br.readLine();
            }
        return data;

        } catch (IOException exception){
            return null;
        }
    }

    static String generateHtmlFromRoars(List<List<String>> roars){
        String htmlOutput = "";
        for(List<String> roar : roars){
            htmlOutput += ("<div class='container'><div class='card' style='width: 100%''><div class='card-body'><h5 class='card-title'>" + roar.get(0) + "</h5><p class='card-text'>" + roar.get(1) +"</p><h6 class='card-subtitle mb-2 text-muted'>"+ roar.get(2) +"</h6></div></div></div>");
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
            message = msgPair[1];
        }

        String roar = name + "," + message + "," + LocalDateTime.now().toString();
        //remove random linebreaks from datetime
        roar = roar.replace("\n", "").replace("\r", "");
        // replace + with spaces
        roar = roar.replace("+", " ");

        BufferedWriter writer = new BufferedWriter(new FileWriter("data/roars.csv", true));
        writer.append('\n');
        writer.append(roar);
        
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

        List<List<String>> allRoars = loadRoars("data/roars.csv");
        List<List<String>> all = allRoars.sort((l1, l2) -> l1.get(2).compareTo(l2.get(2)));
        String roarsHtml = generateHtmlFromRoars(allRoars);

        System.out.print("Content-Type: text/html\r\n\r\n");
        System.out.println(htmlUpper);
        System.out.println(roarsHtml);
        System.out.println(htmlLower);
    }
}

