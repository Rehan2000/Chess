//shif alt f
var database = firebase.database();
time = ""
$(document).ready(function () {

   u = [];
   kingblackischecked = false;
   kingwhiteischecked = false;
   firstmove = 0;
   playerturn = 'white'
   rumb = false;
   pauseb = false
   startb = false
   time = ""
   winner = ""
   pwanrow = ""
   pwancol = ""
   pawncoll = ""
   var selection = { piece: '', player: '', row: '', col: '' }
   seekwbool = false;
   seekbbool = false;
   seekwboolo = false;
   seekbboolo = false;
   document.getElementById("bishop").addEventListener('click', addbo);
   document.getElementById("queen").addEventListener('click', addqo);
   document.getElementById("knight").addEventListener('click', addko);
   document.getElementById("rook").addEventListener('click', addro);
   document.getElementById("kingwhite").addEventListener('click', seekingwhite);
   document.getElementById("kingblack").addEventListener('click', seekingblack);
   document.getElementById("kingwhiteo").addEventListener('click', seekingwhiteo);
   document.getElementById("kingblacko").addEventListener('click', seekingblacko);
   choice = 0;
   o = document.getElementById("options");
   const minutesInput = document.getElementById("minutesInput"),
      pauseButton = document.getElementById("pauseButton"),
      unpauseButton = document.getElementById("unpauseButton"),
      startButton = document.getElementById("startButton"),
      counterDivw = document.getElementById("counterDisplayw"),
      counterDivb = document.getElementById("counterDisplayb");
   pauseButton.addEventListener('click', pausebonline);
   unpauseButton.addEventListener('click', runbonline);
   startButton.addEventListener('click', startbonline);

   putmoveonnline("player", "piece", "row", "col", "targetrow", "targetcol", "false", "targetplayer", "targetpiece")
   putplayerturnnline(playerturn)
   countpoints();
   markwrongpieceforking();
   getpmoveonline();
   getstartbonline()
   getpausebonline()
   getrunbonline()
   getplayeronline();
   getchoiceonline();
   gettimeonline();
   puttimernnline()
   reseto();
   disable(pauseButton);
   disable(unpauseButton);
   let totalSeconds;
   let timer;
   let totalSeconds2;
   o.style.display = "none"


   $("[piece]").each(function () {
      let player = $(this).attr('player'),
         piece = $(this).attr('piece'),
         boardsquarecolor = $(this).css('background-color')
      if (piece == "") {
         $(this).attr('empty', 'true')
         $(this).removeAttr('player').removeAttr('piece')
         return;
      } else if (piece == "king" || piece == "rook") {
         $(this).attr('notmove', 'true')
      }
      $(this).attr('empty', 'false')
      $(this).css("background", "url(piecees/" + player + "/" + piece + ".png)").css("background-size", "50px 50px").css('background-color', boardsquarecolor)
      putcolor($(this).attr('row'), $(this).attr('col'))

      //putchangesonline(piece, $(this).attr('row'), $(this).attr('col'), player, $(this).attr('num'))
   })

   $("[empty]").on("click", function () {
      console.log("---------" + playerturn + "---------");
      var empty = $(this).attr('empty'),
         targetpiece = $(this).attr('piece'),
         targetplayer = $(this).attr('player'),
         targetrow = $(this).attr('row'),
         targetcol = $(this).attr('col')
      console.log(selection.piece);
      if (targetplayer == playerturn) {
         if (targetpiece == "rook" && selection.piece == "king" && $("[row='" + targetrow + "'][col='" + targetcol + "']").attr("notmove") == "true" && $("[row='" + selection.row + "'][col='" + selection.col + "']").attr("notmove") == "true") {
            putplayerturnnline(playerturn)
            correctmove(selection.player, "castling", selection.row, selection.col, targetrow, targetcol, targetpiece, targetplayer)


         } else {
            $("[empty='false']").each(function () {
               if ($(this).hasClass('square-grey')) {
                  var bgcolor = 'grey'
               } else {
                  var bgcolor = 'white'
               }
               $(this).css('background-color', bgcolor)

            })

            $(this).css('background-color', "green ")
            putcolor(targetrow, targetcol)
            selection = { piece: targetpiece, player: targetplayer, row: targetrow, col: targetcol }


         }
      } else if (selection.piece != '' && selection.player != '' && selection.player == playerturn && targetrow != selection.row || selection.col != targetcol) {

         if (typeof targetpiece == 'undefined') {
            targetpiece = ''
         }
         if (typeof targetplayer == 'undefined') {
            targetplayer = ''
         }
         putplayerturnnline(playerturn)
         correctmove(selection.player, selection.piece, selection.row, selection.col, targetrow, targetcol, targetpiece, targetplayer)
      } else {
         console.log("no move or wrong move")
      }

   })



   // Defines functions to disable and re-enable HTML elements
   function disable(element) { element.setAttribute("disabled", ""); }
   function enable(element) { element.removeAttribute("disabled"); }

   ///online

   function getpmoveonline() {
      var dbref = firebase.database().ref().child('move/');
      dbref.on('value', (snapshot) => {
         x = snapshot.val();
         player = x.player
         piece = x.piece
         row = x.row
         col = x.col
         targetcol = x.targetcol
         targetrow = x.targetrow
         k = x.k
         targetplayer = x.targetplayer
         targetpiece = x.targetpiece
         movepiece(player, piece, row, col, targetrow, targetcol, k, targetplayer, targetpiece);
      });


   } function putmoveonnline(player, piece, row, col, targetrow, targetcol, k, targetplayer, targetpiece) {
      firebase.database().ref('move/').set({
         player: player,
         piece: piece,
         row: row,
         col: col,
         targetrow: targetrow,
         targetcol: targetcol,
         k: k,
         targetplayer: targetplayer,
         targetpiece: targetpiece,

      });

   } function getplayeronline() {
      var dbref = firebase.database().ref().child('playerturn/');
      dbref.on('value', (snapshot) => {
         x = snapshot.val();
         playerturn = x.playerturn
      });
      console.log(playerturn)

   } function putplayerturnnline(playerturn) {
      firebase.database().ref('playerturn/').set({
         playerturn: playerturn

      });

   } function getrunbonline() {
      var dbref = firebase.database().ref().child('run/');
      dbref.on('value', (snapshot) => {
         x = snapshot.val();
         rumb = x.runb
         if (rumb) {
            runTimer();
            rumb = false;
            runbonline(rumb)
         }
      })
   } function runbonline(pab) {
      rumb = true
      if (pab == false) {
         rumb = false
      }
      firebase.database().ref('run/').set({
         runb: rumb
      });
   } function getpausebonline() {
      var dbref = firebase.database().ref().child('pause/');
      dbref.on('value', (snapshot) => {
         x = snapshot.val();
         pauseb = x.pauseb
         if (pauseb) {
            pauseTimer();
            pauseb = false
            pausebonline(pauseb)
         }
      })
   } function pausebonline(pab) {
      pauseb = true
      if (pab == false) {
         pauseb = false
      }
      firebase.database().ref('pause/').set({
         pauseb: pauseb
      });
   } function getstartbonline() {
      var dbref = firebase.database().ref().child('start/');
      dbref.on('value', (snapshot) => {
         x = snapshot.val();
         startb = x.startb

         if (startb) {
            start();
            startb = false;
            firstmove = 7;
            startbonline(startb)
         }
      })
   } function startbonline(pab) {
      startb = true
      if (pab == false) {
         startb = false
      }
      firebase.database().ref('start/').set({
         startb: startb
      });
   } function gettimeonline() {
      var dbref = firebase.database().ref().child('time/');
      dbref.on('value', (snapshot) => {
         x = snapshot.val();
         time = x.time
         minutesInput.value = time
         console.log(time)
      });

   } function addbo() {
      choice = 1;
      firebase.database().ref('choice/').set({
         choice: choice

      });
      reseto();
   } function addko() {
      choice = 2;
      firebase.database().ref('choice/').set({
         choice: choice

      });
      reseto();
   } function addqo() {
      console.log("queen")
      choice = 3;
      firebase.database().ref('choice/').set({
         choice: choice

      });
      reseto();
   } function addro() {
      choice = 4;
      firebase.database().ref('choice/').set({
         choice: choice

      });
      reseto();
   } function reseto() {
      choice = 0;
      firebase.database().ref('choice/').set({
         choice: choice

      });
   } function getchoiceonline() {
      var dbref = firebase.database().ref().child('choice/');
      dbref.on('value', (snapshot) => {
         x = snapshot.val();
         choice = x.choice
         if (choice == 1) {
            addb()
            choice = 0;
         } else if (choice == 2) {
            addk()
            choice = 0;
         } else if (choice == 3) {
            addq()
            choice = 0;
         } else if (choice == 4) {
            addr()
            choice = 0;
         }
      });

   }


   ///online


   function correctmove(player, piece, row, col, targetrow, targetcol, targetpiece, targetplayer) {
      row = parseInt(row);
      col = parseInt(col);
      targetrow = parseInt(targetrow);
      targetcol = parseInt(targetcol);
      var canmove = false;
      if (piece == 'pawn') {

         if (player == 'white') {
            var rowlogic = row + 1;
            if (row == 2) {
               var frowlogic = row + 2
               marktwo = targetrow - 1


            } removetwo = targetrow - 2

         } else {
            var rowlogic = row - 1;
            if (row == 7) {
               var frowlogic = row - 2
               marktwo = targetrow + 1

            } removetwo = targetrow + 2
         }
         if (targetpiece == "" && targetcol == col && targetplayer == "") {
            if (targetrow == rowlogic || targetrow == frowlogic) {
               canmove = true;
               console.log("3")
               console.log(targetrow, removetwo, targetcol)
               if (targetrow == frowlogic) {

                  $("[row='" + marktwo + "'][col='" + targetcol + "']").attr("jumped", "true")
               }
               if (targetrow == rowlogic && $("[row='" + removetwo + "'][col='" + col + "']").attr("jumped") == "true") {
                  $("[row='" + removetwo + "'][col='" + col + "']").attr("jumped", "false")
               }

            }
         }
         else if (targetpiece != "" && targetplayer != "" && targetrow == rowlogic) {
            if (targetcol == col - 1 || targetcol == col + 1) {
               canmove = true;
               console.log("2")
               if (targetrow == rowlogic && $("[row='" + removetwo + "'][col='" + col + "']").attr("jumped") == "true") {
                  $("[row='" + removetwo + "'][col='" + col + "']").attr("jumped", "false")
               }
            }
         } else if ((targetpiece == "" && targetplayer == "" && targetrow == rowlogic)) {
            if ((targetcol == col - 1 || targetcol == col + 1) && $("[row='" + targetrow + "'][col='" + targetcol + "']").attr("jumped") == "true") {
               targetpiece = "pawn"
               if (playerturn == "white") { targetplayer = "black" } else { targetplayer = "white" }
               console.log("1")
               canmove = true;
            }
         }

      } else if (piece == 'rook') {
         canmove = straignlinecheck(row, col, targetrow, targetcol);

      } else if (piece == 'bishop') {
         canmove = diagonalcheck(row, col, targetrow, targetcol);
      } else if (piece == "queen") {
         canmove = diagonalcheck(row, col, targetrow, targetcol) || straignlinecheck(row, col, targetrow, targetcol)
      } else if (piece == "knight") {
         if (targetrow == row + 2 && targetcol == col + 1 || targetrow == row - 2 && targetcol == col - 1 || targetrow == row - 2 && targetcol == col + 1 || targetrow == row + 2 && targetcol == col - 1 || targetrow == row + 1 && targetcol == col + 2 || targetrow == row - 1 && targetcol == col - 2 || targetrow == row - 1 && targetcol == col + 2 || targetrow == row + 1 && targetcol == col - 2) {
            canmove = true;
         }
      } else if (piece == "king") {
         a = kingmove(col, row, targetcol, targetrow, player, 1, 1)
         e = kingmove(col, row, targetcol, targetrow, player, -1, -1)
         b = kingmove(col, row, targetcol, targetrow, player, -1, 1)
         c = kingmove(col, row, targetcol, targetrow, player, 1, -1)
         d = kingmove(col, row, targetcol, targetrow, player, 1, 0)
         f = kingmove(col, row, targetcol, targetrow, player, -1, 0)
         g = kingmove(col, row, targetcol, targetrow, player, 0, 1)
         h = kingmove(col, row, targetcol, targetrow, player, 0, -1)
         if (a || b || c || d || e || f || g || h) { canmove = true; }
      } else if (piece == "castling") {
         if (targetcol == 8) {
            if ($("[row='" + targetrow + "'][col='" + (targetcol - 1) + "']").attr("empty") == 'true' &&
               $("[row='" + targetrow + "'][col='" + (targetcol - 2) + "']").attr("empty") == 'true' && (
                  $("[row='" + targetrow + "'][col='" + (targetcol - 1) + "']").attr("kw") == 'true' &&
                  $("[row='" + targetrow + "'][col='" + (targetcol - 2) + "']").attr("kw") == 'true' &&
                  $("[row='" + targetrow + "'][col='" + (targetcol - 3) + "']").attr("kw") == 'true' ||
                  $("[row='" + targetrow + "'][col='" + (targetcol - 1) + "']").attr("kb") == 'true' &&
                  $("[row='" + targetrow + "'][col='" + (targetcol - 2) + "']").attr("kb") == 'true' &&
                  $("[row='" + targetrow + "'][col='" + (targetcol - 3) + "']").attr("kb") == 'true')) {
               piece = "king"
               putmoveonnline(player, piece, row, col, targetrow, targetcol - 1, false, targetplayer, targetpiece)
               putmoveonnline(player, targetpiece, targetrow, targetcol, targetrow, targetcol - 2, true, targetplayer, targetpiece)
            }
         } else if (targetcol == 1) {
            if ($("[row='" + targetrow + "'][col='" + (targetcol + 1) + "']").attr("empty") == 'true' &&
               $("[row='" + targetrow + "'][col='" + (targetcol + 2) + "']").attr("empty") == 'true' &&
               $("[row='" + targetrow + "'][col='" + (targetcol + 3) + "']").attr("empty") == 'true' && (
                  $("[row='" + targetrow + "'][col='" + (targetcol + 1) + "']").attr("kb") == 'true' &&
                  $("[row='" + targetrow + "'][col='" + (targetcol + 2) + "']").attr("kb") == 'true' &&
                  $("[row='" + targetrow + "'][col='" + (targetcol + 3) + "']").attr("kb") == 'true' &&
                  $("[row='" + targetrow + "'][col='" + (targetcol + 4) + "']").attr("kb") == 'true' ||
                  $("[row='" + targetrow + "'][col='" + (targetcol + 1) + "']").attr("kw") == 'true' &&
                  $("[row='" + targetrow + "'][col='" + (targetcol + 2) + "']").attr("kw") == 'true' &&
                  $("[row='" + targetrow + "'][col='" + (targetcol + 3) + "']").attr("kw") == 'true' &&
                  $("[row='" + targetrow + "'][col='" + (targetcol + 4) + "']").attr("kw") == 'true')) {
               piece = "king"
               putmoveonnline(player, piece, row, col, targetrow, targetcol + 2, false, targetplayer, targetpiece)
               putmoveonnline(player, targetpiece, targetrow, targetcol, targetrow, targetcol + 3, true, targetplayer, targetpiece)
            }
         }
      }
      //endarea
      console.log(canmove, player, piece, row, col, targetrow, targetcol, targetplayer, targetpiece)
      if (canmove) {
         putmoveonnline(player, piece, row, col, targetrow, targetcol, false, targetplayer, targetpiece)
         markwrongpieceforking();
      }
      countpoints();
      $("[kb='false']").each(function () {
         console.log($(this).attr('piece') == "king" && $(this).attr('player') == "black");
         if ($(this).attr('piece') == "king" && $(this).attr('player') == "black") {
            kingblackischecked = true;
         }
      })
      $("[kw='false']").each(function () {
         if ($(this).attr('piece') == "king" && $(this).attr('player') == "white") {
            kingwhiteischecked = true;
         }
      })
      console.log(kingwhiteischecked, kingblackischecked)
   }



   function movepiece(player, piece, row, col, targetrow, targetcol, k, targetplayer, targetpiece) {
      if ($("[row='" + row + "'][col='" + col + "']").hasClass('square-grey')) {
         var bgcolor = 'grey'
      } else {
         var bgcolor = 'white'
      }
      if ($("[row='" + targetrow + "'][col='" + targetcol + "']").hasClass('square-grey')) {
         var tbgcolor = 'grey'
      } else {
         var tbgcolor = 'white'
      }
      if ($("[row='" + row + "'][col='" + col + "']").hasClass('square-grey')) {
         var bbgcolor = 'white'
      } else {
         var bbgcolor = 'grey'
      }
      $("[row='" + row + "'][col='" + col + "']").css("background-image", "none").css('background-color', bgcolor).attr("player", "").attr("piece", "").attr("empty", "true")
      console.log(targetrow, targetcol, targetplayer, targetpiece)
      if (targetpiece == "pawn") {
         if (targetplayer == "white" && targetrow == 4) {
            $("[row='" + (targetrow - 1) + "'][col='" + targetcol + "']").attr("jumped", "false")
         } else if (targetplayer == "white" && targetrow == 3) {
            $("[row='" + (targetrow) + "'][col='" + targetcol + "']").attr("jumped", "false")
            $("[row='" + (targetrow + 1) + "'][col='" + targetcol + "']").css("background-image", "none").css('background-color', bbgcolor).attr("player", "").attr("piece", "").attr("empty", "true")

         }
         else if (targetplayer == "black" && targetrow == 5) {
            console.log(targetrow, targetcol)
            $("[row='" + (targetrow + 1) + "'][col='" + targetcol + "']").attr("jumped", "false")
         } else if (targetplayer == "black" && targetrow == 6) {
            console.log(targetrow, targetcol)
            $("[row='" + (targetrow) + "'][col='" + targetcol + "']").attr("jumped", "false")
            $("[row='" + (targetrow - 1) + "'][col='" + targetcol + "']").css("background-image", "none").css('background-color', bbgcolor).attr("player", "").attr("piece", "").attr("empty", "true")

         }
      }


      var targetpiece = $("[row='" + targetrow + "'][col='" + targetcol + "']").attr("piece");
      var targetplayer = $("[row='" + targetrow + "'][col='" + targetcol + "']").attr("player");
      z = $("[row='" + row + "'][col='" + col + "']").attr("num")
      $("[row='" + row + "'][col='" + col + "']").removeAttr('num')
      $("[row='" + targetrow + "'][col='" + targetcol + "']").css("background", "url(piecees/" + player + "/" + piece + ".png)").css("background-size", "50px 50px").css('background-color', tbgcolor).attr("player", player).attr("piece", piece).attr("empty", "false")
      $("[row='" + targetrow + "'][col='" + targetcol + "']").attr("num", z)

      console.log("succesful " + piece + " move")
      firstmove = firstmove + 1;
      if (firstmove == 2) {
         firstmove = firstmove + 1;
         start();
         console.log("done")
      }
      selection = { piece: '', player: '', row: '', col: '' }

      $("[row='" + row + "'][col='" + col + "']").attr("notmove", "false")

      if (targetpiece == "king" && targetplayer != playerturn || playerturn == "") {
         gameends(playerturn);
      } else if (k) {

      }
      else {
         if (playerturn == "white") {
            playerturn = "black"

         } else {
            playerturn = "white"

         }
      }
      if (piece == "pawn") {
         checkforpawn(player, piece, targetrow, targetcol);
      }
      putplayerturnnline(playerturn);
   }


   function diagonalcheck(row, col, targetrow, targetcol) {
      var canmove = "";
      console.log(row, col);
      console.log(targetrow, targetcol);
      if (row - targetrow == targetcol - col) {
         if (targetcol > col) {
            var loops = targetcol - col
         } else if (targetcol < col) {
            var loops = col - targetcol
         } else {
            console.log("hhere")
            canmove = "false";
         }
         for (x = 1; x <= loops; x++) {
            if (targetcol > col) {
               var looptargetcol = col + x
               var looptargetrow = row - x
            } else if (targetcol < col) {
               var looptargetcol = col - x
               var looptargetrow = row + x
            }
            console.log(looptargetrow, looptargetcol)
            if ($("[row='" + looptargetrow + "'][col='" + looptargetcol + "']").attr("empty") == 'true') {
               continue;
            } else {
               if (looptargetcol == targetcol && looptargetrow == targetrow) {
                  continue;
               } else {
                  console.log("here")
                  canmove = "false";
                  break;
               }
            }
         }
      } else if (row - targetrow == col - targetcol) {
         if (targetcol > col) {
            var loops = targetcol - col
         } else if (targetcol < col) {
            var loops = col - targetcol
         } else {
            console.log("hherre")
            canmove = "false";
         }
         for (x = 1; x <= loops; x++) {
            if (targetcol > col) {
               var looptargetcol = col + x
               var looptargetrow = row + x
            } else if (targetcol < col) {
               var looptargetcol = col - x
               var looptargetrow = row - x
            }
            console.log(looptargetrow, looptargetcol)
            if ($("[row='" + looptargetrow + "'][col='" + looptargetcol + "']").attr("empty") == 'true') {
               continue;
            } else {
               if (looptargetcol == targetcol && looptargetrow == targetrow) {
                  continue;
               } else {
                  console.log("herre")
                  canmove = "false";
                  break;
               }
            }
         }
      } else {
         var canmove = "false";
      }
      if (canmove != "false") {
         canmove = true;
      } else {
         canmove = false;
      }
      return canmove;
   } function straignlinecheck(row, col, targetrow, targetcol) {
      var canmove = "";
      if (targetrow == row) {
         console.log(row, targetrow);
         console.log(col, targetcol);
         if (targetcol > col) {
            var loops = targetcol - col
         } else if (targetcol < col) {
            var loops = col - targetcol
         } else {
            canmove = "false";
         }
         for (x = 1; x <= loops; x++) {
            if (targetcol > col) {
               var looptargetcol = col + x
            } else if (targetcol < col) {
               var looptargetcol = col - x
            }
            if ($("[row='" + targetrow + "'][col='" + looptargetcol + "']").attr("empty") == 'true') {
               continue;
            } else {
               if (looptargetcol == targetcol) {
                  continue;
               } else {
                  canmove = "false";
                  break;
               }
            }
         }
      } else if (targetcol == col) {
         console.log(row, targetrow);
         console.log(col, targetcol);
         if (targetrow > row) {
            var loops = targetrow - row
         } else if (targetrow < row) {
            var loops = row - targetrow
         } else {
            canmove = "false";
         }
         for (x = 1; x <= loops; x++) {
            if (targetrow > row) {
               var looptargetrow = row + x
            } else if (targetrow < row) {
               var looptargetrow = row - x
            }
            if ($("[row='" + looptargetrow + "'][col='" + targetcol + "']").attr("empty") == 'true') {
               continue;
            } else {
               if (looptargetrow == targetrow) {
                  continue;
               } else {
                  canmove = "false";
                  break;
               }
            }
         }
      } else {
         canmove = "false"
      }
      if (canmove != "false") {
         canmove = true;
      } else {
         canmove = false;
      }
      return canmove;
   } function kingmove(col, row, targetcol, targetrow, player, x, y) {
      canmove = false
      if (player == "white") {
         if ((targetrow == row + x && targetcol == col + y) && $("[row='" + targetrow + "'][col='" + targetcol + "']").attr("kw") == "true") {
            canmove = true
         }
      } else {
         if ((targetrow == row + x && targetcol == col + y) && $("[row='" + targetrow + "'][col='" + targetcol + "']").attr("kb") == "true") {
            canmove = true
         }
      }
      return canmove;
   }

   function markwrongpieceforking() {
      $("[row]").each(function () {
         $(this).attr('kw', 'true')
         $(this).attr('kb', 'true')
      })
      $("[piece]").each(function () {
         let player = $(this).attr('player'),
            piece = $(this).attr('piece'),
            row = $(this).attr('row'),
            col = $(this).attr('col')
         row = parseInt(row);
         col = parseInt(col);
         if (player == "white") {
            reducecode(col, row, piece, "kb")
         } else if (player == "black") {
            reducecode(col, row, piece, "kw")
         }
      })
   } function reducecode(col, row, piece, s) {

      var r = []
      if (piece == "pawn") {
         if (s == "kb") {
            r.push([row + 1, col - 1])
            r.push([row + 1, col + 1])
         }
         else {
            r.push([row - 1, col - 1])
            r.push([row - 1, col + 1])
         }
      } else if (piece == "rook") {
         p = []
         p = straightkingcheck(row, col)
         r = r.concat(p)
      } else if (piece == "bishop") {
         p = []
         p = diagonalkingcheck(row, col)
         r = r.concat(p)
      } else if (piece == "queen") {
         p = []
         p = diagonalkingcheck(row, col)
         r = r.concat(p)
         p = []
         p = straightkingcheck(row, col)
         r = r.concat(p)
      } else if (piece == "knight") {
         x = 0
         y = 0
         x = row + 2
         y = col + 1; r.push([x, y])
         x = row - 2
         y = col - 1; r.push([x, y])
         x = row - 2
         y = col + 1; r.push([x, y])
         x = row + 2
         y = col - 1; r.push([x, y])
         x = row + 1
         y = col + 2; r.push([x, y])
         x = row - 1
         y = col - 2; r.push([x, y])
         x = row - 1
         y = col + 2; r.push([x, y])
         x = row + 1
         y = col - 2; r.push([x, y])

      } else if (piece == "king") {
         x = 0
         y = 0
         x = row + 1
         y = col + 1; r.push([x, y])
         x = row - 1
         y = col - 1; r.push([x, y])
         x = row
         y = col + 1; r.push([x, y])
         x = row
         y = col - 1; r.push([x, y])
         x = row + 1
         y = col; r.push([x, y])
         x = row - 1
         y = col; r.push([x, y])
         x = row - 1
         y = col + 1; r.push([x, y])
         x = row + 1
         y = col - 1; r.push([x, y])
      }
      x = r.length
      for (x = 0; x < r.length; x++) {
         $("[row='" + r[x][0] + "'][col='" + r[x][1] + "']").attr(s, 'false')
      }
   } function diagonalkingcheck(row, col) {
      x = []
      //right+up
      for (y = (row + 1), w = (col + 1); y < 10; y++, w++) {
         if ($("[row='" + y + "'][col='" + w + "']").attr("empty") == 'true') {
            x.push([y, w])
         }
         else if ($("[row='" + y + "'][col='" + w + "']").attr("empty") != 'true') {
            x.push([y, w])
            break;
         }
      }
      //left+up
      for (y = (row + 1), w = (col - 1); y < 10; y++, w--) {
         if ($("[row='" + y + "'][col='" + w + "']").attr("empty") == 'true') {
            x.push([y, w])
         }
         else if ($("[row='" + y + "'][col='" + w + "']").attr("empty") != 'true') {
            x.push([y, w])
            break;
         }
      }
      //left down
      for (y = (row - 1), w = (col - 1); y < 10; y--, w--) {
         if ($("[row='" + y + "'][col='" + w + "']").attr("empty") == 'true') {
            x.push([y, w])
         }
         else if ($("[row='" + y + "'][col='" + w + "']").attr("empty") != 'true') {
            x.push([y, w])
            break;
         }
      }
      //right-down
      for (y = (row - 1), w = (col + 1); y < 10; y--, w++) {
         if ($("[row='" + y + "'][col='" + w + "']").attr("empty") == 'true') {
            x.push([y, w])
         }
         else if ($("[row='" + y + "'][col='" + w + "']").attr("empty") != 'true') {
            x.push([y, w])
            break;
         }
      }

      return x;
   } function straightkingcheck(row, col) {
      x = []
      for (y = (row - 1); y < 10; y--) {
         if ($("[row='" + y + "'][col='" + col + "']").attr("empty") == 'true') {
            x.push([y, col])
         }
         else if ($("[row='" + y + "'][col='" + col + "']").attr("empty") != 'true') {
            x.push([y, col])
            break;
         }
      }
      //row +right
      for (y = (col + 1); y > 0; y++) {
         if ($("[row='" + row + "'][col='" + y + "']").attr("empty") == 'true') {
            x.push([row, y])
         }
         else if ($("[row='" + row + "'][col='" + y + 1 + "']").attr("empty") != 'true') {
            x.push([row, y])
            break;
         }
      }
      //row -left
      for (y = (col - 1); y > 0; y--) {
         if ($("[row='" + row + "'][col='" + y + "']").attr("empty") == 'true') {
            x.push([row, y])
         }
         else if ($("[row='" + row + "'][col='" + y + 1 + "']").attr("empty") != 'true') {
            x.push([row, y])
            break;
         }
      }
      //col-up
      for (y = (row + 1); y < 10; y++) {
         if ($("[row='" + y + "'][col='" + col + "']").attr("empty") == 'true') {
            x.push([y, col])
         }
         else if ($("[row='" + y + "'][col='" + col + "']").attr("empty") != 'true') {
            x.push([y, col])
            break;
         }
      }
      return x;
   }



   function countpoints() {
      ws = document.getElementById("pointswhite")
      bs = document.getElementById("pointsblack")
      w = 0
      y = 0
      $("[piece]").each(function () {
         let player = $(this).attr('player'),
            piece = $(this).attr('piece')
         if (player == "white") {
            if (piece == "pawn") {
               w++
            } else if (piece == "rook") {
               w = w + 5
            } else if (piece == "knight") {
               w = w + 3
            } else if (piece == "queen") {
               w = w + 10
            } else if (piece == "bishop") {
               w = w + 3
            }

         }
         else {
            if (piece == "pawn") {
               y++
            } else if (piece == "rook") {
               y = y + 5
            } else if (piece == "knight") {
               y = y + 3
            } else if (piece == "queen") {
               y = y + 10
            } else if (piece == "bishop") {
               y = y + 3
            }
         }



      })
      w = 40 - w
      y = 40 - y
      bs.innerHTML = `<div>Scores : ${w} </div>`
      ws.innerHTML = `<div>Scores : ${y} </div>`
   } function gameends(p) {
      winner = p
      playerturn = ""
      putplayerturnnline(playerturn);
      console.log(winner + " winner")
   } function putcolor(row, col) {
      if ($("[row='" + row + "'][col='" + col + "']").css("background-color") != "green") {
         var css = '.board div[player]:hover{ background-color: #2558E4 !important }';
         var style = document.createElement('style');
         if (style.styleSheet) {
            style.styleSheet.cssText = css;
         } else {
            style.appendChild(document.createTextNode(css));
         }
         document.getElementsByTagName('head')[0].appendChild(style);
      }
   } function getMinutes(totalSeconds) {
      return Math.floor(totalSeconds / 60); // Gets quotient rounded down 
   } function getSeconds(totalSeconds) {
      let seconds = totalSeconds % 60; // Gets remainder after division
      return (seconds < 10 ? "0" + seconds : seconds) // Inserts "0" if needed
   } function start() {

      totalSeconds = minutesInput.value * 60; // Sets initial value of totalSeconds based on user input
      totalSeconds2 = minutesInput.value * 60;
      counterDivw.innerHTML = getMinutes(totalSeconds) + ":" + getSeconds(totalSeconds); // Initializes display
      counterDivb.innerHTML = getMinutes(totalSeconds2) + ":" + getSeconds(totalSeconds2); // Initializes display

      disable(minutesInput); disable(startButton); // Toggles buttons
      runTimer();
   } function runTimer() {
      // Is the main timer function, calls `tick` every 1000 milliseconds

      timer = setInterval(tick, 1000);

      disable(unpauseButton); enable(pauseButton); // Toggles buttons
   } function tick() {
      if (playerturn == "white") {
         if (totalSeconds > 0) {
            totalSeconds--; // Decreases total seconds by one
            counterDivw.innerHTML = getMinutes(totalSeconds) + ":" + getSeconds(totalSeconds); // Updates display         
         }
         else {

            gameends("black")
         }
      } else if (playerturn == "black") {
         if (totalSeconds2 > 0) {
            totalSeconds2--; // Decreases total seconds by one
            counterDivb.innerHTML = getMinutes(totalSeconds2) + ":" + getSeconds(totalSeconds2); // Updates display         
         }
         else {
            // The timer has reached zero. Let the user start again. 
            gameends("white")
         }
      }

   } function pauseTimer() {
      // Stops calling `tick` and toggles buttons

      clearInterval(timer);
      disable(pauseButton); enable(unpauseButton);
   }

   function addq() {
      countpoints();
      $("[row='" + pwanrow + "'][col='" + pwancol + "']").attr("piece", "queen").css("background", "url(piecees/" + pawncoll + "/" + "queen" + ".png)").css("background-size", "50px 50px")
      o.style.display = "none"
      $("[empty='false']").each(function () {
         if ($(this).hasClass('square-grey')) {
            var bgcolor = 'grey'
         } else {
            var bgcolor = 'white'
         }
         $(this).css('background-color', bgcolor)
      })
      countpoints();
      if (pawncoll == "white") {
         playerturn = "black"
      } else { playerturn = "white" }
   } function addk() {
      countpoints();
      $("[row='" + pwanrow + "'][col='" + pwancol + "']").attr("piece", "knight").css("background", "url(piecees/" + pawncoll + "/" + "knight" + ".png)").css("background-size", "50px 50px")
      o.style.display = "none"
      $("[empty='false']").each(function () {
         if ($(this).hasClass('square-grey')) {
            var bgcolor = 'grey'
         } else {
            var bgcolor = 'white'
         }
         $(this).css('background-color', bgcolor)
      })
      countpoints();
      if (pawncoll == "white") {
         playerturn = "black"
      } else { playerturn = "white" }
   } function addb() {
      countpoints();
      $("[row='" + pwanrow + "'][col='" + pwancol + "']").attr("piece", "bishop").css("background", "url(piecees/" + pawncoll + "/" + "bishop" + ".png)").css("background-size", "50px 50px")
      o.style.display = "none"
      $("[empty='false']").each(function () {
         if ($(this).hasClass('square-grey')) {
            var bgcolor = 'grey'
         } else {
            var bgcolor = 'white'
         }
         $(this).css('background-color', bgcolor)
      })
      countpoints();
      if (pawncoll == "white") {
         playerturn = "black"
      } else { playerturn = "white" }
   } function addr() {
      countpoints();
      $("[row='" + pwanrow + "'][col='" + pwancol + "']").attr("piece", "rook").css("background", "url(piecees/" + pawncoll + "/" + "rook" + ".png)").css("background-size", "50px 50px")
      o.style.display = "none"
      $("[empty='false']").each(function () {
         if ($(this).hasClass('square-grey')) {
            var bgcolor = 'grey'
         } else {
            var bgcolor = 'white'
         }
         $(this).css('background-color', bgcolor)
      })
      countpoints();
      if (pawncoll == "white") {
         playerturn = "black"
      } else { playerturn = "white" }
   } function checkforpawn(player, pieece, row, col) {

      if (player == "white" && row == 8) {
         o.style.display = "block"
         $("[pieece]").each(function () {
            piece = $(this).attr('pieece'),
               boardsquarecolor = $(this).css('background-color')
            $(this).css("background", "url(piecees/" + player + "/" + piece + ".png)").css("background-size", "50px 50px").css('background-color', boardsquarecolor)
         })
         pwanrow = "" + row
         pwancol = "" + col
         pawncoll = "" + player
         playerturn = ""
         //achived
      } else if (player == "black" && row == 1) {
         o.style.display = "block"
         $("[pieece]").each(function () {
            piece = $(this).attr('pieece'),
               boardsquarecolor = $(this).css('background-color')
            $(this).css("background", "url(piecees/" + player + "/" + piece + ".png)").css("background-size", "50px 50px").css('background-color', boardsquarecolor)
         })
         pwanrow = "" + row
         pwancol = "" + col
         pawncoll = "" + player
         playerturn = ""
      }

   }

   function seekingwhite() {
      var css
      var style
      if (!seekwbool) {
         seekwbool = true;
         css = '[kw="true"]{background-color: green  !important; }';
         style = document.createElement('style');
         console.log(style.styleSheet)
         style.appendChild(document.createTextNode(css));
         document.getElementById('csskw').appendChild(style);
      } else {
         seekwbool = false;
         document.getElementById('csskw').innerHTML = "";
      }



   } function seekingblack() {
      var css
      var style
      if (!seekbbool) {
         seekbbool = true;
         css = '[kb="true"]{background-color: yellow  !important; }';
         style = document.createElement('style');
         console.log(style.styleSheet)
         style.appendChild(document.createTextNode(css));
         document.getElementById('csskb').appendChild(style);
      } else {
         seekbbool = false;
         document.getElementById('csskb').innerHTML = "";
      }
   } function seekingwhiteo() {
      var css
      var style
      if (!seekwboolo) {
         seekwboolo = true;
         css = '[kw="false"]{background-color: red  !important; }';
         style = document.createElement('style');
         console.log(style.styleSheet)
         style.appendChild(document.createTextNode(css));
         document.getElementById('csskwo').appendChild(style);
      } else {
         seekwboolo = false;
         document.getElementById('csskwo').innerHTML = "";
      }



   } function seekingblacko() {
      var css
      var style
      if (!seekbboolo) {
         seekbboolo = true;
         css = '[kb="false"]{background-color: orange  !important; }';
         style = document.createElement('style');
         console.log(style.styleSheet)
         style.appendChild(document.createTextNode(css));
         document.getElementById('csskbo').appendChild(style);
      } else {
         seekbboolo = false;
         document.getElementById('csskbo').innerHTML = "";
      }
   }

})
function puttimernnline() {
   time = minutesInput.value
   firebase.database().ref('time/').set({
      time: time

   });
   console.log(time)
}