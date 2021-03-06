#  Code Standards of BTES :clipboard: <h2>

## BTES 
is a Monorepo for Blockchain Technology Education Software project.

# Folder Structure
| **`Backend`** | **`Common`** | **`Frontend`** |
|:-:|-|-|

## Frontend Folder
All three package have a  *`Src`* folder. Only the source folders goes participate in build.

Component and pages folder are in the src folder of `frontend`. Pages are related with its name. 
 > `F.e:` Home page is inside the  Home folder. 
 >Sandbox page is inside the Sandbox folder. 

## Public 
For frontend, public folder is also direcly copied to the build output. 
For this reason we don't prefer to put something in the `public` folder unless it's possible.


## Common 
Both backend and frontend use *`common`* package. However; Common package cannot import from other packages. 


## Backend Folder
The codes that control the **rest end points** are in the ``restController`` folder.
> Example: "hello word" route + controller 
> @route ('simulation Insance Broker') ../simulationInstanceBroker/create/

* We add it to the end. The name of the folder is the name of the route.
* The name of the file is having route + controller.


## Components
Component names start with a **capital letter**. However, there are components that do not fall directly on the page.

## Eslint & Prettier & Stylelint
 We implement `ESLint` that is static code analysis tool for identifying problematic patterns found in code.  [eslint rule](https://eslint.org/docs/rules/) 

 We implement `Prettier` that is an opinionated code formatter to our code. [prettier rule](https://prettier.io/docs/en/options.html) 

 We implement `stylelint` that uses cosmiconfig for our css files to find and load css configuration object. [stylelint rule](https://stylelint.io/user-guide/rules/list) 


## Styles
Style files start with a `capital letter`. 
Scss, which is more innovative, was preferred as style files.
We added the style files to the same place next to the components.
Also, the names of the style files have the same name as the pages they are linked to.

   ## Css naming structure 
```scss
.page-home {
  // ...

  &--sub-class {
    //...

    &--3rd-level-class {
      //...
    }
  }
}
 ```
[css-formats](https://github.com/ctisbtes/btes/pull/18)

 ## On the naming structure for css and Syntax

### page | comp | global - component name | global selector name [ -- sub-class name [ -- 3rd level class name ... ] 

## Functions
Functions always start with a `lowercase` letter. Also, The first letter must be lowercase, adjacent, and the next word starts with capital. :camel: [camelCase Format](https://eslint.org/docs/rules/camelcase)

## Classes
We use `Pascal Case` in class names, the first letter of the words starts with a capital. PascalCase in which the first letter of each word in a compound word is capitalized. [`PascalCase Format`](https://palantir.github.io/tslint/rules/class-name/)

## Interfaces and Types
Beside, the Pascal case convention is always used to signify that an identifier is a type, or interface.

## Singleton 
Camel case are used for Singleton naming however; typed same name for Singleton.

## Variables and Constants
Camel case are used for variables and constants.

## Global Style
There is only global styles available in the style folder in root.

## Utilities
In utils, there are stateless utilities that can be reusable.

## Functions Typing
We write our functions as `arrow` functions assigned to variables. 

## Variables 
We define variables as `const` or read only (inside the class) as much as possible.

## Tests
We add the extension of the test files as `.spec`.
>f.e: If the main page named as *Example.ts.* So, *Example.spec.ts* have been given. 

## Exports
As much as possible, only one export is kept in a `single file`. However, there are some exceptions.
