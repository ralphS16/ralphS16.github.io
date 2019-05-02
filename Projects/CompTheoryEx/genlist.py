import os

#text that will be printed to html file
listtext = "<h1>Exercises from Introduction to the Theory of Computation by Michael Sipser (3rd. ed. Intl.)</h1>\n"

for chdir in sorted(os.listdir("./Exercises")): #look at  chapter directories (have the form 00-19)
	chdirpath = os.path.join("./Exercises", chdir)
	if os.path.isdir(chdirpath):
		if chdir.isdigit():
			chapter = int(chdir) #get integer value of chapter for title
			listtext += "<h2>Part %d</h2>\n<table>\n" %(chapter) #append the chapter title (handle chapter 0)

			for sedir in sorted(os.listdir(chdirpath)): #look at section directories (have the form xx, where x is a digit)
				sedirpath = os.path.join(chdirpath, sedir)
				if os.path.isdir(sedirpath):
					if sedir.isdigit():
						section = int(sedir) #get integer value for section title
						exercises = sorted(os.listdir(sedirpath))
						rspan = len(exercises)/10 + 1
						count = 0
						listtext += "<tr>\n<th rowspan='%d'>Chapter %d</th>\n" %(rspan,section) #append the section row
						for exfile in exercises:
							if exfile[:2].isdigit() and exfile[-4:] == "html":
								exercise = int(exfile[:2])
								count += 1
								listtext += '<td><a onclick="loadex({0},{1},{2})" href="#"> {1}.{2} </a></td>\n'.format(chapter,section, exercise)
								if count == 10:
									count = 0
									listtext += '</tr>\n<tr>\n'
						listtext += "</tr>\n"
			listtext += "</table>\n"
with open("list.html", "w") as f:
	f.write(listtext)
