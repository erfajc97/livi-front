const logoSvg = new Proxy({"src":"/_astro/logo.Cw23L2Gs.svg","width":200,"height":32,"format":"svg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/Jaely/Documents/Nondecansts/nondecants-front/src/assets/logo.svg";
							}
							
							return target[name];
						}
					});

export { logoSvg as l };
