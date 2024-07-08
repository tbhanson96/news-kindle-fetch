import { sendEpubs, nyTimes, economist } from "./book-utils";
import commandLineArgs, { OptionDefinition } from 'command-line-args';

const options: OptionDefinition[] = [
  {
    name: 'book', type: String, multiple: true, defaultOption: true, defaultValue: 'nytimes'
  }
];

(async () => {
  const results: string[] = [];
  const args: any = commandLineArgs(options);

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

  await sendEpubs(results);
})();