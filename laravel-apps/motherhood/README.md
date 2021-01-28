# Laravel & API General Reference

## Common CLI commands:
Start a local server  
`php artisan serve --host=localhost`  

Create a fresh database  
`php artisan migrate:fresh`  

Seed the database  
`php artisan db:seed`  

Clear the caches  
`php artisan route: cache`  
`php artisan config:cache`  
`php artisan view:clear`  

Make a new model  
`php artisan make:model <ModelName> -m`  

Make a new factory (not currently used).  
`php artisan make:factory <FactoryName>`  
 
Make a new controller  
`php artisan make:controller <ControllerName> -r --api`  

Make a new resource  
`php artisan make:resource <ResourceName>`  

Display a list of the API URLs  
`php artisan route:list`  

Print to the console   
`$out = new \Symfony\Component\Console\Output\ConsoleOutput();`   
`$out->writeln("Print statement here.");`   

## API Call Walk-through to construct a previously constructed motherhood (GET calls):
-Get the block categories being used by the squadron (http://localhost:8000/api/block-categories?squadron=Squadron 1)

-(Display the active block squadrons on front end)

-Get the active shift template for the squadron's shift name (http://localhost:8000/api/shift-templates?is_only_active=true&shift=days&squadron=Squadron 1)

-(Front end will have to pull the shift template ID out of the data response)

-Get the shift template instance matching the template ID [Test ID = 1] (http://localhost:8000/api/shift-template-instances/1)

-Get the line templates for a squadron (http://localhost:8000/api/line-templates?squadron=Squadron 1)

-(Front end will have to determine the which line instances to load (is active and is default logic))

-Get the line instance for each line template with known shift template instance ID (http://localhost:8000/api/line-instances?shift_template_instance=1&line_template=2)

-(For each of the line instances, can begin to display lines on front end)

-For each line instance, get the shift line time blocks with the line instance ID (http://localhost:8000/api/shift-line-time-blocks?line_instance=1)
-(Can begin to fill in the shift line time blocks for the line instances on front end)

-For each shift line time block, get the crew member shift line time blocks, or use list of shift line time block ids (http://localhost:8000/api/crew-shift-line-time-blocks?crew_member=1&shift_line_time_block_list=1, 2, 3, 4)

-Get any crew members working for the day (http://localhost:8000/api/flight-orders?date=2020-09-25)

-For each crew member on the flight orders, get the crew member information, or use list of crew member ids (http://localhost:8000/api/crew-members?crew_members=1,2,3,4)

-(Can begin to populate the rosters on the front end)

-Get the qualification types (http://localhost:8000/api/qualification-type)

-For each crew member, get the qualifications for that crew member, or use list of crew member ids (http://localhost:8000/api/qualifications?crew_members=1,2,3,4)
