let calcStr = '';

function calculation(bufferStr) {
   // Добавляем пробелы вокруг математических операций и скобок
   bufferStr = bufferStr = bufferStr.replace(/([^[0-9.]{1})/g, ' $1 ').trim();
   // Удаляем сдвоенные пробелы
   bufferStr = bufferStr.replace(/ {1,}/g, ' ');
   // Добавляем все элементы строки в массив
   const bufferArr = bufferStr.split(/\s/);

   // Формируем обратную польскую запись:
   // 1+(2+5)*10 => 1,2,5,+,10,*,+
   let polishString = [];
   let polishStack = [];
   let stringId = -1;
   let stackId = -1;

   for (let i = 0; i < bufferArr.length; i++) {
      switch (bufferArr[i]) {
         case '+':
            while (stackId >= 0 && (polishStack[stackId] === '+'
               || polishStack[stackId] === '-'
               || polishStack[stackId] === '*'
               || polishStack[stackId] === '/')) {
               stringId++;
               polishString[stringId] = polishStack[stackId];
               stackId--;
            }
            stackId++;
            polishStack[stackId] = bufferArr[i];
            break;
         case '-':
            while (stackId >= 0 && (polishStack[stackId] === '+'
               || polishStack[stackId] === '-'
               || polishStack[stackId] === '*'
               || polishStack[stackId] === '/')) {
               stringId++;
               polishString[stringId] = polishStack[stackId];
               stackId--;
            }
            stackId++;
            polishStack[stackId] = bufferArr[i];
            break;
         case '*':
            while (stackId >= 0 && (polishStack[stackId] === '*' || polishStack[stackId] === '/')) {
               stringId++;
               polishString[stringId] = polishStack[stackId];
               stackId--;
            }
            stackId++;
            polishStack[stackId] = bufferArr[i];
            break;
         case '/':
            while (stackId >= 0 && (polishStack[stackId] === '*' || polishStack[stackId] === '/')) {
               stringId++;
               polishString[stringId] = polishStack[stackId];
               stackId--;
            }
            stackId++;
            polishStack[stackId] = bufferArr[i];
            break;
         case '(':
            stackId++;
            polishStack[stackId] = bufferArr[i];
            break;
         case ')':
            while (stackId >= 0 && polishStack[stackId] != '(') {
               stringId++;
               polishString[stringId] = polishStack[stackId];
               stackId--;
            }
            stackId--;
            break;
         default:
            stringId++;
            polishString[stringId] = bufferArr[i];
      }
   }

   while (stackId >= 0) {
      stringId++;
      polishString[stringId] = polishStack[stackId];
      stackId--;
   }

   // Производим вычисления по обратной польской записи
   stackId = -1;
   let stringIdMax = stringId;

   for (stringId = 0; stringId <= stringIdMax; stringId++) {
      switch (polishString[stringId]) {
         case '+':
            stackId--;
            polishStack[stackId] = polishStack[stackId] + polishStack[stackId + 1];
            break;
         case '-':
            stackId--;
            polishStack[stackId] = polishStack[stackId] - polishStack[stackId + 1];
            break;
         case '*':
            stackId--;
            polishStack[stackId] = polishStack[stackId] * polishStack[stackId + 1];
            break;
         case '/':
            stackId--;
            polishStack[stackId] = polishStack[stackId] / polishStack[stackId + 1];
            break;
         default:
            stackId++;
            polishStack[stackId] = parseFloat(polishString[stringId]);
      }
   }
   return polishStack[stackId];
}

function equal() {
   if (calcStr) {
      let result = '';
      try {
         result = calculation(calcStr);
      } catch (error) {
         result = "Ошибка в выражении";
      }
      document.form.textview.value = calcStr + '=' + result;
   }
}

function addToInput(value) {
   calcStr += value;
   calcStr = control(calcStr);
   document.form.textview.value = calcStr;
}

function clean() {
   calcStr = '';
   document.form.textview.value = calcStr;
}

function back() {
   calcStr = calcStr.substr(0, calcStr.length - 1);
   document.form.textview.value = calcStr;
}

function control(checkStr) {
   checkStr = checkStr.replace(/\++/g, "+");
   checkStr = checkStr.replace(/\--/g, "+");
   checkStr = checkStr.replace(/\.\./g, ".");
   checkStr = checkStr.replace(/[+-][-+]/g, "-");
   return checkStr;
}
