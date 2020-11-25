import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import startOfYear from 'date-fns/startOfYear';
import endOfYear from 'date-fns/endOfYear';
import startOfDay from 'date-fns/startOfDay';
import endOfDay from 'date-fns/endOfDay';
import { format } from '../helpers/date';

const mixin = {
    methods: {
        getPeriodByPeriodName(date, periodicity) {
            const period = {};
            const opt = { weekStartsOn: 1 };

            switch (periodicity.toUpperCase()) {
                case 'YEAR':
                    period.begin = startOfYear(date);
                    period.end = endOfYear(date);
                    break;
                case 'MONTH':
                    period.begin = startOfMonth(date);
                    period.end = endOfMonth(date);
                    break;
                case 'WEEK':
                    period.begin = startOfWeek(date, opt);
                    period.end = endOfWeek(date, opt);
                    break;
                case 'DAY':
                    period.begin = startOfDay(date);
                    period.end = endOfDay(date);
                    break;
                default:
                    period.begin = startOfYear(date);
                    period.end = endOfYear(date);
                    break;
            }

            return period;
        },

        formatPeriod(period) {
          return {
            begin: format(period.begin),
            end: format(period.end)
          };
        }
    }
};

export default mixin;
