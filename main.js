var foreign_id = 'es'
var native_id = 'en'
var native_name = 'English'
var foreign_name = 'Spanish'

var hearts = false

var type = {
    TRANSLATE_FN : 'translate_fn',
    TRANSLATE_NF : 'translate_nf',
    WRITE_NF : 'write_nf',
    CHOOSE_PIC_NF : 'choose_pic_nf',
    CHOOSE_TEXT_NF : 'choose_text_nf',
    CLICK_FN : 'click_fn',
    CLICK_NF : 'click_nf',
    COMPLETE_NF : 'complete_nf',
}

var correct_answers = {}

var curr_hint_sentence = null

var timeout = null
var manual = true

function getElementByDataTest(t) {
    return document.querySelectorAll(`[data-test="${t}"]`)[0];
}

function getElementsByDataTest(t) {
    return document.querySelectorAll(`[data-test="${t}"]`);
}

function trimText(t) {
    return t.replaceAll(/\.|\?|,|!|¡|¿/g, "").toLowerCase()
}

function getTranslation(source_text, source_lang, target_lang) {
    if (!hearts) {
        return 'guess'
    }
    
    var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl="
            + source_lang + "&tl=" + target_lang + "&dt=t&q=" + encodeURI(source_text);
    
    var xml_http = new XMLHttpRequest();
    xml_http.open( "GET", url, false ); // false for synchronous request
    xml_http.send( null );
    return JSON.parse(xml_http.responseText)[0][0][0];
}

function getType() {
    
    let ele = getElementByDataTest('challenge-header');
    
    if (!ele) {
        return null
    }
    
    let s = ele.children[0].innerHTML
    
    switch (s) {
        case `Write this in ${native_name}`:
            if (getElementByDataTest('challenge-translate-input')) {
                return type.TRANSLATE_FN
            }
            return type.CLICK_FN

        case `Write this in ${foreign_name}`:
            if (getElementByDataTest('challenge-translate-input')) {
                return type.TRANSLATE_NF
            }
            return type.CLICK_NF

        case (new RegExp(`Write “[^”]*” in ${foreign_name}`).test(s) ? s : null):
            return type.WRITE_NF

        case (new RegExp(`Which one of these is “[^”]*”?`).test(s) ? s : null):
            return type.CHOOSE_PIC_NF
            
        case `Mark the correct meaning`:
            return type.CHOOSE_TEXT_NF
            
        case `Complete the translation`:
            return type.COMPLETE_NF

    }
}

function getHintSentence(lesson_type) {
    let ele = getElementByDataTest('hint-sentence')
    let sent = ''
    if (ele) {
        for (let token of ele.children) {
            sent += token.innerHTML
        }
    }
    
    switch (lesson_type) {
        case null:
            return null
            
        case type.TRANSLATE_FN:
            return sent
        case type.TRANSLATE_NF:
            return sent
        case type.WRITE_NF:
            return getElementByDataTest('challenge-header').children[0].innerHTML.match(/“([^”]*)”/)[1]
        case type.CHOOSE_PIC_NF:
            return getElementByDataTest('challenge-header').children[0].innerHTML.match(/“([^”]*)”/)[1]
        case type.CHOOSE_TEXT_NF:
            return document.getElementsByClassName('_3-JBe')[0].innerHTML
        case type.CLICK_FN:
            return sent
        case type.CLICK_NF:
            return sent
        case type.COMPLETE_NF:
            return sent
    }
}

function solveExercise() {
    let lesson_type = getType()
    
    switch (lesson_type) {
        case null:
            var t = getElementByDataTest('challenge-judge-text')
            if (t) {
                t.click()
            }
            var next_button = getElementByDataTest('player-next')
            next_button.click()
            return true
            
        case type.TRANSLATE_FN:
            var hint_sentence = getHintSentence(type.TRANSLATE_FN)
            var answer_box = getElementByDataTest('challenge-translate-input')
            var answer = ''
            if (correct_answers[hint_sentence]) {
                answer = correct_answers[hint_sentence]
            }
            else {
                answer = getTranslation(hint_sentence, foreign_id, native_id)
            }
            
            answer = trimText(answer)
            
            var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
            nativeInputValueSetter.call(answer_box, answer);
            var ev2 = new Event('input', { bubbles: true});
            answer_box.dispatchEvent(ev2);
            
            var next_button = getElementByDataTest('player-next')
            curr_hint_sentence = hint_sentence
            next_button.click()

            return true
            
        case type.TRANSLATE_NF:
            var hint_sentence = getHintSentence(type.TRANSLATE_NF)
            var answer_box = getElementByDataTest('challenge-translate-input')
            var answer = ''
            if (correct_answers[hint_sentence]) {
                answer = correct_answers[hint_sentence]
            }
            else {
                answer = getTranslation(hint_sentence, native_id, foreign_id)
            }
            
            answer = trimText(answer)
            
            var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
            nativeInputValueSetter.call(answer_box, answer);
            var ev2 = new Event('input', { bubbles: true});
            answer_box.dispatchEvent(ev2);
            
            var next_button = getElementByDataTest('player-next')
            curr_hint_sentence = hint_sentence
            next_button.click()
            
            return true
            
        case type.WRITE_NF:
            var hint_sentence = getHintSentence(type.WRITE_NF)
            
            var answer_box = getElementByDataTest('challenge-text-input')
            var answer = ''
            if (correct_answers[hint_sentence]) {
                answer = correct_answers[hint_sentence]
            }
            else {
                answer = getTranslation(hint_sentence, native_id, foreign_id)
            }
            
            answer = trimText(answer)
            
            var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
            nativeInputValueSetter.call(answer_box, answer);
            var ev2 = new Event('input', { bubbles: true});
            answer_box.dispatchEvent(ev2);
            
            var next_button = getElementByDataTest('player-next')
            curr_hint_sentence = hint_sentence
            next_button.click()
            
            return true
            
        case type.CHOOSE_PIC_NF:
            var hint_sentence = getHintSentence(type.CHOOSE_PIC_NF)
            
            var answer_boxes = getElementsByDataTest('challenge-choice-card')

            var answer = ''
            if (correct_answers[hint_sentence]) {
                answer = correct_answers[hint_sentence]
            }
            else {
                answer = getTranslation(hint_sentence, native_id, foreign_id)
            }
            
            answer = trimText(answer)
            
            var correct_box = 0
            
            for (let i=0; i < answer_boxes.length; i++) {
                let answer_box = answer_boxes[i]
                let text = trimText(answer_box.children[2].children[0].children[0].innerHTML)
                if (answer == text) {
                    correct_box = i
                    break
                }
            }

            answer_boxes[correct_box].click()
            
            var next_button = getElementByDataTest('player-next')
            curr_hint_sentence = hint_sentence
            next_button.click()
            
            return true
            
        case type.CHOOSE_TEXT_NF:
            var hint_sentence = getHintSentence(type.CHOOSE_TEXT_NF)
            
            var answer_boxes = getElementsByDataTest('challenge-choice')

            var answer = ''
            if (correct_answers[hint_sentence]) {
                answer = correct_answers[hint_sentence]
            }
            else {
                answer = getTranslation(hint_sentence, native_id, foreign_id)
            }
            
            answer = trimText(answer)
            
            var correct_box = 0
            
            for (let i=0; i < answer_boxes.length; i++) {
                let answer_box = answer_boxes[i]
                let text = trimText(answer_box.children[2].innerHTML)
                if (answer == text) {
                    correct_box = i
                    break
                }
            }

            answer_boxes[correct_box].click()
            
            var next_button = getElementByDataTest('player-next')
            curr_hint_sentence = hint_sentence
            next_button.click()
            
            return true
        
        case type.CLICK_FN:
            var hint_sentence = getHintSentence(type.CLICK_FN)
            
            var click_tokens = Array.from(getElementsByDataTest('challenge-tap-token'))
            
            var answer = ''
            if (correct_answers[hint_sentence]) {
                answer = correct_answers[hint_sentence]
                delete correct_answers[hint_sentence]
            }
            else {
                answer = getTranslation(hint_sentence, foreign_id, native_id)
            }
            
            answer = trimText(answer)
            answer = answer.split(' ')
            
            var clicked = false

            for (let i=0; i < answer.length; i++) {
                let word = answer[i]
                for (let j=0; j < click_tokens.length; j++) {
                    let token = click_tokens[j]
                    let text = trimText(token.innerHTML)
                    if (text == word || (word.includes("'") && word.split("'")[0] == text)) {
                        token.click()
                        click_tokens.splice(j, 1)
                        if (text != word && (word.includes("'") && word.split("'")[0] == text)) {
                            answer[i] = "'" + word.split("'")[1]
                            i--
                        }
                        clicked = true
                        break
                    }
                }
            }
            if (!clicked) {
                click_tokens[0].click()
            }
            
            var next_button = getElementByDataTest('player-next')
            curr_hint_sentence = hint_sentence
            next_button.click()
            
            return true
            
        case type.CLICK_NF:
            var hint_sentence = getHintSentence(type.CLICK_NF)
            
            var click_tokens = Array.from(getElementsByDataTest('challenge-tap-token'))
            
            var answer = ''
            if (correct_answers[hint_sentence]) {
                answer = correct_answers[hint_sentence]
            }
            else {
                answer = getTranslation(hint_sentence, native_id, foreign_id)
            }
            
            answer = trimText(answer)
            answer = answer.split(' ')
            
            var clicked = false

            for (let i=0; i < answer.length; i++) {
                let word = answer[i]
                for (let j=0; j < click_tokens.length; j++) {
                    let token = click_tokens[j]
                    let text = trimText(token.innerHTML)
                    if (text == word || (word.includes("'") && word.split("'")[0] == text)) {
                        token.click()
                        click_tokens.splice(j, 1)
                        if (text != word && (word.includes("'") && word.split("'")[0] == text)) {
                            answer[i] = "'" + word.split("'")[1]
                            i--
                        }
                        clicked = true
                        break
                    }
                }
            }
            if (!clicked) {
                click_tokens[0].click()
            }
            
            var next_button = getElementByDataTest('player-next')
            curr_hint_sentence = hint_sentence
            next_button.click()
            
            return true
            
        case type.COMPLETE_NF:
            var hint_sentence = getHintSentence(type.COMPLETE_NF)
            
            var answer_box = getElementByDataTest('challenge-text-input')
            var answer = ''
            if (correct_answers[hint_sentence]) {
                answer = correct_answers[hint_sentence]
            }
            else {
                answer = getTranslation(hint_sentence, native_id, foreign_id)
            }
            
            answer = trimText(answer)
            
            let parent = document.getElementsByClassName('_3f_Q3 _2FKqf _2ti2i sXpqy')[0]
            
            let partial_answer = ''
            for (let i=0; i < parent.childElementCount; i++) {
                if (!parent.children[i].childElementCount) {
                    partial_answer += parent.children[i].innerHTML
                }
            }
            
            partial_answer = trimText(partial_answer)
            
            let a_split = answer.split(' ')
            let p_a_split = partial_answer.split(' ')
            
            for (let i=0; i < Math.min(a_split.length, p_a_split.length); i++) {
                if (a_split[i] != p_a_split[i]) {
                    answer = a_split[i]
                    break
                }
            }
            
            // var t = answer.match(new RegExp(`(.*)${partial_answer}`))
            
            // if (t && t.length >= 1) {
                // answer = t[1]
            // }
            
            var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
            nativeInputValueSetter.call(answer_box, answer);
            var ev2 = new Event('input', { bubbles: true});
            answer_box.dispatchEvent(ev2);
            
            var next_button = getElementByDataTest('player-next')
            curr_hint_sentence = hint_sentence
            next_button.click()
            
            return true
    }
    return false
}

function solveSet(number = 1) {
    var next_button = getElementByDataTest('player-next')
    if (next_button) {
        let bg_color = window.getComputedStyle(next_button).backgroundColor
        
        if ((bg_color == 'rgb(234, 43, 43)' || bg_color == 'rgb(88, 167, 0)')) {
            if (bg_color == 'rgb(234, 43, 43)' && curr_hint_sentence) {
                let e = document.getElementsByClassName('_1UqAr _1sqiF')[0]
                let text = ''
                for (let s of e.children) {
                    if (s.childElementCount) {
                        for (let r of s.children) {
                            text += r.innerHTML + ' '
                        }
                    }
                    else {
                        text += s.innerHTML + ' '
                    }
                }
                if (text.length > 0) {
                    text = text.slice(0, -1)
                }
                else {
                    text = e.innerHTML
                }
                if (correct_answers[curr_hint_sentence] && text.includes(',')) {
                    correct_answers[curr_hint_sentence] = trimText(text.split(',')[0])
                }
                else {
                    correct_answers[curr_hint_sentence] = trimText(text)
                }
                
                curr_hint_sentence = null
            }
            next_button.click()
            timeout = setTimeout(() => {solveSet(number)}, 500)
        }
        else {
            let cont = true
            if (!document.getElementsByClassName('YQ0lZ _2LMXW _3vF5k _3iFZd').length) {
                if (correct_answers[curr_hint_sentence]) {
                    delete correct_answers[curr_hint_sentence]
                }
                cont = solveExercise(correct_answers)
                
            }
            if (cont) {
                timeout = setTimeout(() => {solveSet(number)}, 100)
            }
        }
    }
    else {
        for (let key in correct_answers) {
            delete correct_answers[key]
        }
        number--
        if (number > 0) {
            timeout = setTimeout(() => {pickSets(number)}, 1000)
        }
    }
}

function pickSets(number = 1) {
    let sets = getElementsByDataTest('skill')
    if (!sets.length) {
        timeout = setTimeout(() => {pickSets(number)}, 1000)
    }
    else {
        for (let set of sets) {
            let t = set.children[0].children[0].children[0].children[0].children[2].children[0]
            let level = t.childElementCount == 2 ? Number(t.children[1].innerHTML) : 0
            if (level < 5) {
                while(!getElementByDataTest('start-button')) {
                    set.children[0].click()
                }
                getElementByDataTest('start-button').click()
                timeout = setTimeout(() => {startSet(number)}, 1000)
                break
            }
        }
    }
}

function startSet(number = 1) {
    var next_button = getElementByDataTest('player-next')
    if (next_button) {
        curr_hint_sentence = null
        solveSet(number)
    }
    else {
        timeout = setTimeout(() => {startSet(number)}, 1000)
    }
}









