import "frida-il2cpp-bridge";

const watchClasses = {};
const addListener = (assembly, classname, methods, isConsole = false) => {
  watchClasses[classname] =
    Il2Cpp.Domain.assembly(assembly).image.class(classname);

  methods.forEach((method) => {
    try {
      console.log(watchClasses[classname].method(method?.name || method));
      watchClasses[classname].method(method?.name || method).intercept({
        onEnter(instance, parameters) {
          isConsole &&
            console.log(
              `${classname}.${method?.name || method}`,
              instance,
              parameters && Object.keys(parameters)
            );
          method.onEnter && method.onEnter(instance, parameters, this);
        },
        onLeave(retVal) {
          isConsole &&
            console.log(
              `${classname}.${method?.name || method}:return`,
              retVal?.value
            );
          method.onLeave && method.onLeave(retVal);
        },
      });
    } catch (ex) {
      console.error("Method ex:", JSON.stringify(ex, null, 4), method);
    }
  });
};

const updateFunctions = (
  enabled,
  clss,
  method,
  implementation,
  assembly = "Assembly-CSharp"
) => {
  if (!enabled) return;
  const cls = Il2Cpp.Domain.assembly(assembly).image.class(clss);
  cls.method(method).implementation = function (...params) {
    return implementation.call(this, { method }, ...params);
  };
};

export { addListener, updateFunctions };
