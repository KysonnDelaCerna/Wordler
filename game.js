$(document).ready(async function () {
    // attach button functions
    $('#showhelp').click(function () {
        $('#helpmodal').fadeIn(150);
    });

    $('#closehelp').click(function () {
        $('#helpmodal').fadeOut(150);
    });

    $('#showscore').click(function () {
        $('#scoremodal').fadeIn(150);
        $('#highscore').text(highscore);
        $('#gamesplayed').text(gamesplayed);
        $('#wordsguessed').text(wordsguessed);
    });

    $('#closescore').click(function () {
        $('#scoremodal').fadeOut(150);
    });

    $('#closegameover').click(function () {
        $('#gameovermodal').fadeOut(150);
        reset();
    });

    $('#Enter').click(function () {
        enter();
    })

    $('#Back').click(function () {
        back();
    })

    $('.key').click(function () {
        pressbutton($(this).attr('id'));
    })

    $(document).keydown(function (e) {
        switch (e.which) {
            case 8: back(); break;
            case 13: enter(); break;
            case 65: pressbutton('A'); break;
            case 66: pressbutton('B'); break;
            case 67: pressbutton('C'); break;
            case 68: pressbutton('D'); break;
            case 69: pressbutton('E'); break;
            case 70: pressbutton('F'); break;
            case 71: pressbutton('G'); break;
            case 72: pressbutton('H'); break;
            case 73: pressbutton('I'); break;
            case 74: pressbutton('J'); break;
            case 75: pressbutton('K'); break;
            case 76: pressbutton('L'); break;
            case 77: pressbutton('M'); break;
            case 78: pressbutton('N'); break;
            case 79: pressbutton('O'); break;
            case 80: pressbutton('P'); break;
            case 81: pressbutton('Q'); break;
            case 82: pressbutton('R'); break;
            case 83: pressbutton('S'); break;
            case 84: pressbutton('T'); break;
            case 85: pressbutton('U'); break;
            case 86: pressbutton('V'); break;
            case 87: pressbutton('W'); break;
            case 88: pressbutton('X'); break;
            case 89: pressbutton('Y'); break;
            case 90: pressbutton('Z'); break;
        }
    })

    // load data
    let dictionary4 = await $.getJSON('dictionary4.json');
    let dictionary5 = await $.getJSON('dictionary5.json');
    let dictionary6 = await $.getJSON('dictionary6.json');

    // game
    let score;
    let attemptnumber;
    let word;
    let guess;
    let isgameover;
    let attempthistory;
    let highscore = 0;
    let gamesplayed = 0;
    let wordsguessed = 0;

    const CORRECT_COLOR = "bg-green-700";
    const PARTIAL_COLOR = "bg-yellow-600";
    const WRONG_COLOR = "bg-gray-600";

    if (await load()) {
        guess = '';
        for (let i = 0; i < attempthistory.length; i++) {
            await checkAttempt(i);
        }

        if (word.length < 6) {
            $('.attempts>h6').hide();
        }
        if (word.length < 5) {
            $('.attempts>h5').hide();
        }

        if (score > 0) {
            $('#title').text(`Score: ${score}`);
            $('#title').attr('class', 'text-2xl font-extrabold my-auto');
        }

    } else {
        reset();
    }

    function reset () {
        score = 0;
        attemptnumber = 1;
        word = '';
        guess = '';
        isgameover = false;
        attempthistory = [];
        $('#title').text(`Wordler`);
        $('#title').attr('class', 'text-5xl font-extrabold my-auto');
        newword();
        save();
    }

    function newword () {
        let random = Math.floor(Math.random() * 3);

        switch(random) {
            case 0: {
                word = dictionary4[Math.floor(Math.random() * dictionary4.length)];
                break;
            }
            case 1: {
                word = dictionary5[Math.floor(Math.random() * dictionary5.length)];
                break;
            }
            case 2: {
                word = dictionary6[Math.floor(Math.random() * dictionary6.length)];
                break;
            }
        }

        $('.attempts>*').show();
        $('.attempts>*').attr('class', 'h-12 w-12 my-auto mx-1 border border-gray-900 text-center text-3xl font-bold');
        $('.attempts>*').text('');
        $('.key').attr('class', 'key bg-gray-300 rounded-lg w-8 mx-0.5 text-lg font-semibold');

        if (word.length < 6) {
            $('.attempts>h6').hide();
        }
        if (word.length < 5) {
            $('.attempts>h5').hide();
        }

        word = word.toUpperCase();
    }

    function pressbutton (letter) {
        if (isgameover || guess.length >= word.length) {
            return;
        }

        guess = guess + letter;
        $(`#attempt${attemptnumber}>h${guess.length}`).text(letter);
    }

    function back () {
        if (isgameover || (guess.length <= 0)) {
            return;
        }

        $(`#attempt${attemptnumber}>h${guess.length}`).text('');
        guess = guess.slice(0, -1);
    }

    function save () {
        localStorage.setItem('score', score);
        localStorage.setItem('attemptnumber', attemptnumber);
        localStorage.setItem('word', word);
        localStorage.setItem('isgameover', JSON.stringify(isgameover));
        localStorage.setItem('attempthistory', JSON.stringify(attempthistory));
        localStorage.setItem('highscore', highscore);
        localStorage.setItem('gamesplayed', gamesplayed);
        localStorage.setItem('wordsguessed', wordsguessed);
    }

    async function load () {
        if (localStorage.score && localStorage.attemptnumber && localStorage.word && localStorage.isgameover && localStorage.attempthistory && localStorage.highscore && localStorage.gamesplayed && localStorage.wordsguessed) {
            score = Number(localStorage.getItem('score'));
            attemptnumber = Number(localStorage.getItem('attemptnumber'));
            word = localStorage.getItem('word');
            isgameover = JSON.parse(localStorage.getItem('isgameover'));
            attempthistory = JSON.parse(localStorage.getItem('attempthistory'));
            highscore = Number(localStorage.getItem('highscore'));
            gamesplayed = Number(localStorage.getItem('gamesplayed'));
            wordsguessed = Number(localStorage.getItem('wordsguessed'));

            return true;
        }

        return false;
    }

    async function displayError(text) {
        $('#error').text(text);
        $('#error').fadeIn(150);
        $('#error').fadeOut(500);
    }

    async function getColorFromStatus(status) {
        switch (status) {
            case "correct": 
                return CORRECT_COLOR;
            case "partial":
                return PARTIAL_COLOR;
            case "wrong":
                return WRONG_COLOR;
            case "none":
            default:
                return "";
        }
    }

    async function setGuessColor(selector, status) {
        const color = await getColorFromStatus(status);
        $(selector).attr('class', `h-12 w-12 my-auto mx-1 text-white text-center text-3xl font-bold ${color}`);
    }

    async function setKeyColor(char, status) {
        if ($(`#${char}`).hasClass(CORRECT_COLOR) || $(`#${char}`).hasClass(WRONG_COLOR)) {
            return;
        }

        if ($(`#${char}`).hasClass(PARTIAL_COLOR) && status != "correct") {
            return;
        }

        const color = await getColorFromStatus(status);

        
        $(`#${char}`).attr('class', `key rounded-lg w-8 mx-0.5 text-lg font-semibold ${color}`);
    }

    async function checkAttempt(number) {
        if (number >= attempthistory.length) {
            return;
        }

        const thisAttempt = attempthistory[number];

        for (let i = 0; i < thisAttempt.length; i++) {
            const selector = `#attempt${number + 1}>h${i + 1}`;
            const char = thisAttempt.charAt(i);

            $(selector).text(char);

            if (word.indexOf(char) === -1) {
                setGuessColor(selector, "wrong");
                setKeyColor(char, "wrong");
            } else if (char === word.charAt(i)) {
                setGuessColor(selector, "correct");
                setKeyColor(char, "correct");
            } else {
                let budget = word.split(char).length - 1;
                const occurances = thisAttempt.slice(0, i + 1).split(char).length - 1;

                for (let j = 0; j < word.length; j++) {
                    if (thisAttempt.charAt(j) == word.charAt(j)) {
                        budget -= 1;
                    }
                }

                if (occurances <= budget) {
                    setGuessColor(selector, "partial");
                    setKeyColor(char, "partial");
                } else {
                    setGuessColor(selector, "wrong");
                    setKeyColor(char, "wrong");
                }
            }
        }
    }

    async function enter () {
        if (isgameover) {
            return;
        }

        if (guess.length != word.length) {
            await displayError('Length mismatch');
            return;
        }

        let dictionary = null;

        switch (word.length) {
            case 4: {
                dictionary = dictionary4;
                break;
            }
            case 5: {
                dictionary = dictionary5;
                break;
            }
            case 6: {
                dictionary = dictionary6;
                break;
            }
        }

        if (dictionary != null && dictionary.indexOf(guess.toLowerCase()) == -1) {
            // await displayError('Not in dictionary');
            // return;
        }

        attempthistory.push(guess);
        await checkAttempt(attemptnumber - 1);
        attemptnumber += 1;

        if (guess === word) {
            score += (7 - attemptnumber) + (word.length - 4);
            $('#title').text(`Score: ${score}`);
            $('#title').attr('class', 'text-2xl font-extrabold my-auto');
            await new Promise(r => setTimeout(r, 1000));
            newword();
            attemptnumber = 1;
            attempthistory = [];
            wordsguessed += 1;
        }

        guess = '';
        if (attemptnumber == 7) {
            isgameover = true;
            $('#gameovermodal').fadeIn(150);
            $('#word').text(word);
            $('#score').text(score);
            if (score > highscore) {
                highscore = score;
            }
            $('#bigscore').text(highscore);
            gamesplayed += 1;
            reset();
        } else {
            save();
        }
    }
});
