<h1>Motherhood - Basic Software Requirements Specification (SRS)</h1>

Note: This should be considered a living document and edited/updated as necessary.  Requirement reference numbers, while a bit cumbersome, should not be changed once assigned to a requirement. 

<h3>Basic description of project</h3>

<p>The Motherhood project is a single page application porting the current Excel version of the Motherhood tool used by all squadrons of the 732OG to a web-based implementation.  </p>

<h3>Design Goal </h3>

<p>Any user familiar with the current Excel tool used to build the motherhood schedule should intuitively understand how to use the web based implementation with minimal instruction.</p>

<h3>Scope </h3>

<p>The web application will run in the latest version of Microsoft Edge and Chrome.  Basic Firefox support is ideal, but given the current IFG implementation is not supported by Firefox due to dependence by customer on older version, not a hard requirement. </p>

Acronyms and definitions 

    As required. 

<h3>Requirements Table </h3>

    1.0 User Interface 

        1.1 Each AOR (AORs 1, 2, 3, 4) will be able to see a daily schedule for each of their 3 shifts (Days, Swings, Mids) 

            1.1.1 Adding/Deleting a new AOR should be supported. 

            1.1.3 Adding/Deleting a shift should be supported. 

                1.1.3.1 Editing a shift's hours should be supported. 

                1.1.3.2 Multiple time zones (Local, Zulu) should be supported. 

        1.2 Each motherhood board should comprise of a series of "lines". 

            1.2.1 Adding/Deleting a line should be supported. 

            1.2.2 Categories of lines should be supported. 

                1.2.2.1 Example categories: GCS, Sim, Brief, Surge 1 

            1.2.3 Sub-Categories of lines should be supported. 

                1.2.3.1 Example sub-categories: MQ-9, MQ-1 

            1.2.4 Lines should support a custom color assignment representing the entity. 

            1.2.5 Dynamic (drag and drop) ordering of a line should be supported. 

            1.2.6 Lines must support 0.5 hr blocks of time for an entire shift. 

                1.2.6.1 Each block needs to be able to support a pilot name, a sensor operator name, and one or more instructor names. 

                1.2.6.2 Each block needs to support a custom color assignment. 

                1.2.6.3 Anonymous/unknown crew members should be an option to populate surge lines supported by another AOR. 

        1.3 Task types (Presets, Transit, Target, Training, Down, Maintenance) need to be supported. 

            1.3.1 Adding/Deleting a task type should be supported. 

            1.3.2 Task types need to support a custom color assignment. 

            1.3.3 Each block of time on a line needs to support a dynamically assigned task type. 

        1.4 The user creating the motherhood needs to be able to "highlight" blocks of time on a line and assign a crew member and task type to it. 

        1.5 Crew members should be able to be added to a personnel roster associated with a specific shift. 

            1.5.1 Crew members should be divided up by role (pilot, sensor operator), supporting the notion of multiple rosters. 

                1.5.1.1 Total hours "in the seat" should be provided next to crew members name in each personnel roster. 

                1.5.1.2 Additional roles/quals should be provided next to the crew members name in each personnel roster. 

        1.6 A line should automatically be created to summarize where a crew member is assigned at any given block of time throughout their shift. 

            1.6.1 On the current Excel motherhood tool, these lines are present at the bottom of the schedule, but new UI does not need to confirm to this design. 

                1.6.1.1 Pilots are listed as a group and appear before Sensor Operators. 

                1.6.1.2 Sensor Operators are listed as a group. 

        1.7 An edit mode should be supported. 

            1.7.1 Edits to the motherhood should not be propagated until the editor publishes the schedule. 

            1.7.2 If edit mode is not enabled, changes to the motherhood should not be allowed. 

        1.8 Crews should not have to manually refresh the motherhood schedule in order to see updates. 

        1.9 Conflicts in schedule need to be recognized. 

            1.9.1 Conflicts should still be allowed to be created. 

            1.9.2 A warning about a potential conflict should be provided. 

                1.9.3 The current excel tool will highlight conflicts in yellow when a crew member is assigned to multiple locations at the same time, but does not need to be implemented in the new UI. 

             

    2.0 Database 

        2.1 Web application needs to use MySQL as the backend database. 

        2.2 Data entered via the Motherhood scheduling tool needs to be saved and enable re-creation of any previous shift based on AOR/date/shift. 

            2.2.1 Re-creation of previous shifts will not be developed in this version of the Motherhood. 

        2.3 A single database table design will not be used. 

     

    3.0 Software implementation 

        3.1 Motherhood application should be implemented via a Wordpress plugin. 

        3.2 PHP (due to dependence on Wordpress) should be used for server side code, when possible. 

        3.3 Javascript and associated libraries (to include NodeJS, React) may be used to aid in front end user interface. 

        3.4 Non-standard comment styles will be used to allow for non-developers to be able to follow both "how" and "why" of the code. 

         

Summary of changes to SRS 

    8/31/2020: Initial draft version - ready for peer review. 