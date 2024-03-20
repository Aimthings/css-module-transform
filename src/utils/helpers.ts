import { definedClassArray } from "./constants";

export const transformText = (text: string, styleVariable: string) => {
    return text.replace(
        new RegExp(`(className|class)\\s*=\\s*['"]([\\w\\s-]+)['"]`, "g"),
        (match, classAttribute, className) => {
            const {
                isConverted,
                resultantString
            } = filterAndAppendStyles(className, definedClassArray, styleVariable);
            if(isConverted) {
                return `${classAttribute}=${resultantString}`;
            }
           return `${classAttribute}="${className}"` ; 
        }
    );
};

function filterAndAppendStyles(longString: string, wordsArray : string[], styles: string) {
    let newClassesArray = [];

    const longStringArray = longString?.split(' ');
    const definedClasses = longStringArray.filter( function( value ){
        const classAlreadyDefined = wordsArray.includes( value );
        if(!classAlreadyDefined) {
            newClassesArray.push(value);
        }
        return classAlreadyDefined;
        });
    
    if(!newClassesArray?.length) {   // when only defined classes are present no conversion required
        return { 
            isConverted : false 
        };
    }
        
    if(longStringArray.length === 1) {   // only when single not defined class present
        const word = longStringArray[0];
        const resultantString =  `{${styles}.${word}}`; 
        
        return {
            resultantString,
            isConverted : true
      };
    }

    const filteredString = longStringArray?.map(word => {
         if(wordsArray.includes(word)) {
            return word; // Return filtered word as it is
        } 
            
        return `\${${styles}.${word}}`; // add style variable to each not defined class
        
    }).join(' ');
    const resultantString = `{\`${filteredString}\`}`;
    
    return {
        resultantString,
        isConverted : true
    };
}