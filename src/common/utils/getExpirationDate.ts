import ms, { type StringValue } from 'ms';

export const getExpirationDate = (time: StringValue): Date => {
  let milliseconds: number;

  if (typeof time === 'number') {
    milliseconds = time;
  } else {
    milliseconds = ms(time);
    if (milliseconds === undefined) {
      throw new Error(`Invalid time format: ${time}`);
    }
  }

  return new Date(Date.now() + milliseconds);
};
