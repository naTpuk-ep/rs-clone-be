
export type ItemType = {
	id: string;
	title: string;
	completed: boolean;
	userId: string;
	date: string;
}

export type Session = {
	userId: string;
	expiresAt: string;
	token: string;
}