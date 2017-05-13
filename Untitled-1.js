// let parent = () => {
//    let state = {
//       x: 10,
//       y: 20
//    };

//    return {
//       reset () {
//          state = 10000;
//       },
//       get state() {
//          return state;
//       }
//    }
// }

// let pacman = parent();

// pacman.state = 100000;

// console.log(pacman.state);

function dot(c) {
   console.log(c);
}

var obj = {
   dot
}

obj.dot("hola");

