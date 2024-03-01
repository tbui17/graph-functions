export function getTypes(obj: any[] | Record<any, any>) {
	if (Array.isArray(obj)) {
		return obj
	}
	return Object.keys(obj)
}
