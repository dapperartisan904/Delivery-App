import emojiData from 'emoji-datasource';
import _ from 'lodash';

const parse = (text) => {
    // console.log(text, "in parse")
    _.each(emojiData, (value, key) => {
        var reg = new RegExp('\\[' + value.unified + '\\]', "g");
        const emoji = String.fromCodePoint(...value.unified.split('-').map(u => '0x' + u));
        if(text)
            text = text.replace(reg, emoji);
    });
    // console.log(text, "after parse")
    return text;
};

export default parse;