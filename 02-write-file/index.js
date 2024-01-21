const readline = require('node:readline');
const fs = require('fs');
const path = require('node:path');
const { stdin: input, stdout: output } = require('node:process');

const stream = fs.createWriteStream(path.resolve(__dirname, 'text.txt'));
const rl = readline.createInterface({ input, output });

//rl.prompt();
output.write('введите текст для записи в файл:');
rl.on('line', (input) => {
  if (input === 'exit') {
    endOfSttream();
    return;
  }
  stream.write(input);
});

rl.on('SIGINT', () => {
  endOfSttream();
});

function endOfSttream() {
  rl.close();
  output.write('запись завершена');
}
