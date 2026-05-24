import { sendEpubs, uploadEpubs, nyTimes, economist } from "./book-utils";
import commandLineArgs, { OptionDefinition } from 'command-line-args';

type DeliveryMethod = 'api' | 'email';

const options: OptionDefinition[] = [
  {
    name: 'book', type: String, multiple: true, defaultOption: true
  },
  {
    name: 'delivery', type: String
  }
];

(async () => {
  const results: string[] = [];
  const args: any = commandLineArgs(options);
  const delivery = args.delivery as DeliveryMethod;

  if (!args.book?.length) {
    throw new Error('Missing book option. Expected nytimes or economist.');
  }
  if (!delivery) {
    throw new Error('Missing delivery option. Expected --delivery api or --delivery email.');
  }
  if (delivery !== 'api' && delivery !== 'email') {
    throw new Error(`Unknown delivery option: ${delivery}. Expected api or email.`);
  }

  for (const b of args.book) {
    switch(b) {
      case 'economist': {
        const result = await economist();
        results.push(result!);
        break;
      }
      case 'nytimes': {
        const result = await nyTimes();
        results.push(result!);
        break;
      }
      default: {
        throw new Error(`Unknown book option: ${b}`);
      }
    }
  }

  if (delivery === 'email') {
    await sendEpubs(results);
  } else {
    await uploadEpubs(results);
  }
})();
