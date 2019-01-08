// AmendLetterOfCredit.java

import java.io.*;
import java.util.*;
import java.net.*;
import org.json.*;

public class AmendLetterOfCredit {

	public static void main(String args[]){
	
		// api url
		String apiServiceUrl = "http://smu.tbankonline.com/SMUtBank_API/Gateway";
//		String apiServiceUrl = "http://localhost:8080/SMUtBank_API/Gateway";

		try {		

			// build header
			JSONObject jo = new JSONObject();
			jo.put("serviceName", "amendLetterOfCredit");
			jo.put("userID", "kinetic1");
			jo.put("PIN", "123456");
			jo.put("OTP", "999999");
			JSONObject headerObj = new JSONObject();
			headerObj.put("Header", jo);
			String header = headerObj.toString();
			
			// build content
			jo = new JSONObject();
			jo.put("referenceNumber", "0000001071");
			jo.put("importerAccount", "2365");			// localhost-324, 169-2365, AWS-3398
			jo.put("exporterAccount", "1738");			// localhost-99,  169-1738, AWS-????
			jo.put("expiryDate", "2019-12-31");
			jo.put("expiryPlace", "Singapore");
			jo.put("confirmed", "false");
			jo.put("revocable", "false");
			jo.put("availableBy", "TERM");
			jo.put("termDays", "90");
			jo.put("amount", "9.39");
			jo.put("currency", "SGD");
			jo.put("applicableRules", "none");
			jo.put("partialShipments", "false");
			jo.put("shipDestination", "London");
			jo.put("shipDate", "2017-12-12");
			jo.put("shipPeriod", "90 Days");
			jo.put("goodsDescription", "none");
			jo.put("docsRequired", "none");
			jo.put("additionalConditions", "none");
			jo.put("senderToReceiverInfo", "none");
			jo.put("mode", "BC"); // BC or DB
			JSONObject contentObj = new JSONObject();
			contentObj.put("Content", jo);
			String content = contentObj.toString();

			// connect to API service
			HttpURLConnection urlConnection = (HttpURLConnection) new URL(apiServiceUrl).openConnection();
			urlConnection.setDoOutput(true);
			urlConnection.setRequestMethod("POST");
			
			// build request parameters
			String parameters
				= "Header="+header+"&"
				+ "Content="+content+"&"
				+ "ConsumerID=TF";
				
			// send request
			BufferedWriter br = new BufferedWriter(new OutputStreamWriter(urlConnection.getOutputStream()));
			br.write(parameters);
			br.close();
			
			// get response
			String response = "";
			Scanner s = new Scanner(urlConnection.getInputStream());
			while (s.hasNextLine()){
				response += s.nextLine();
			}
			s.close();
			
			// get response object
			JSONObject responseObj = new JSONObject(response);
			System.out.println(responseObj.toString(4)); // indent 4 spaces
			System.out.println();

		}
		catch(Exception e) {e.printStackTrace(System.out);}
		
	}

}
