/* No package here so we can (in theory) access global classes. */

import java.util.jar.*;
import java.util.*;

import java.io.*;

import java.net.*;

import java.lang.reflect.*;

public class ProcessingLibXmodeUtils
{
	public List getClassNamesInPackage( String jarName ) 
	{
		ArrayList<String> classes = new ArrayList<String>();
		ClassLoader loader = null;
		
		File jarFile = new File(jarName);
		
		/*try {
			loader = URLClassLoader.newInstance(
			    new URL[] { jarFile.toURI().toURL() },
			    getClass().getClassLoader()
			);
		} catch ( Exception e ) {
			e.printStackTrace();
		}*/
		
		FileInputStream fis = null;
		JarInputStream jis = null;
		
		try 
		{
			fis = new FileInputStream (jarFile);
			jis = new JarInputStream(fis);
		
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
		
		JarEntry jarEntry;
		while (true) 
		{
			try 
			{
				jarEntry = jis.getNextJarEntry();
			
			} catch (Exception e) {
				e.printStackTrace();
				break;
			}
			
			if (jarEntry == null) break;
				
			if ( jarEntry.getName().endsWith(".class") ) 
			{
				if ( loader != null )
				{
					String className = jarEntry.getName().replaceAll("/", "\\.").replace(".class","");
					//System.out.println(className);
					Class<?> clazz = null;
					try 
					{
						/*clazz = Class.forName(
							className, true, loader
						);*/

					} catch ( Exception e ) {
						e.printStackTrace();
					}
				}
				
				//System.out.println("Found " + jarEntry.getName().replaceAll("/", "\\."));
				classes.add( jarEntry.getName() );
			}
		}
		
		try 
		{
			jis.close();
			fis.close();
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		if ( classes != null && classes.size() > 0 )
		{
			Node root = new Node("<root>");
			for ( String c : classes )
			{
				String[] prts = c.split("/");
				Node n = root;
				for ( int i = 0; i < prts.length; i++ )
				{
					n = n.getOrAddNode( prts[i].replace(".class","") );
				}
			}
			
			String jsFile = "this[\""+jarFile.getName()+"\"] = "+root.toString()+";";
			try {
				File f = new File( jarFile.getName().replace(".jar",".js") );
				//if ( !f.exists() )
				{
					FileWriter outFile = new FileWriter(f);
					PrintWriter out = new PrintWriter(outFile);
					out.print(jsFile);
					out.close();
				}
			} catch (Exception e) {
				
			}
		}
		
		return classes;
	}
	
	String padding = "";
	
	class Node
	{
		String quot = "\"";
		
		String name;
		HashMap<String,Node> subNodes;
		
		Node ( String name )
		{
			this.name = name;
			subNodes = new HashMap<String, Node>();
		}
		
		Node addNode ( Node n )
		{
			if ( getNode(n.name) == null )
				subNodes.put( n.name, n );
			else
				System.err.println("A Node with that name exists: "+n.name);
			
			return n;
		}
		
		Node getNode ( String name )
		{
			return subNodes.get(name);
		}
		
		Node getOrAddNode ( String name )
		{
			Node n = getNode(name);
			if ( n == null )
				n = addNode(new Node(name));
			return n;
		}
		
		public String toString ()
		{
			String r = "";
			
			if ( !name.equals("<root>") )
				r += quot+name+quot + ":";
				
			r += "{";
			
			padding += "    ";
			String s = subNodesToString();
			padding = padding.substring(4);
			
			if ( s.length() > 0 )
				r += s + "\n" + padding;
			
			r += "}";
			
			return r;
		}
		
		String subNodesToString ()
		{
			String r = "";
			boolean first = true;
			for ( Node n : subNodes.values() )
			{
				r += (first?"":",") + "\n" + padding + n.toString();
				first = false;
			}
			return r;
		}
	}

	public static void main (String[] args) 
	{
		List classesList = null;
		
		for ( String arg : args )
		{
			if ( arg.toLowerCase().endsWith(".jar") )
			{
				System.out.println(arg);
				
				File jarFile = new File(arg);
				if ( jarFile.exists() && jarFile.isFile() && jarFile.canRead() )
				{
					classesList = new ProcessingLibXmodeUtils().getClassNamesInPackage(arg);
					//System.out.println(classesList);
				}
				else
				{
					System.out.println( "Unable to find: "+arg );
				}
			}
			else
			{
				System.out.println( "Not a .jar: "+arg );
			}
		}
	}
}