/**
 * Pacman .look() =>> return the objects around pacman as well as the directions in which they are
 * 		 .validateMove() =>> if the direction of pacman is equal to the direction of one of the objects allow move else stop the pacman
 * 		 .
 * 
 * 
 * 
 * 
 * Assign X,Y coordintes to every element in the map array
 * Pacman
 * 	make a method that detects and returns the empty spaces around pacman
 * 	allow moving only in towards those returned empty spaces
 * 	when the user makes the decision and moves the pacman towards one of the empty spaces, keep the data from that empty space
 * 	every 60 fps check if the coordinates of pacman are equal(or almost equal) to those of the chosen empty space 
 * 	
 * 
 * Element 	.x
 * 			.y
 *				.type
 * Take x and y for the CENTER of the shape
 * 
 * 
 * 
 * Look around then set possibleDestinations property on Pacman.
 * When the user tries to move the pacman, check if the movement destination is present in possibleDestinations.
 * 	If it is not, ignore the command
 * 	If it is, allow pacman to move until the destination point 
 * 
 * 
 * 				
 */