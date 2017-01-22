const _ = require('lodash')

module.exports = (enums) => {

    const $enum = {};
    let defaultValue = 0;

    _.each(enums, (enumKey, index) => {
        enumKey = enumKey.split('=');
        const key = _.trim(_.first(enumKey));
        const value = parseInt(_.trim(_.last(enumKey)));
        $enum[key] = value || (defaultValue++);
    })

    return $enum;
}