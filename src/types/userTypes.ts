export interface user {
	_id?: string;
	profilePic?: string | "";
	fullName?: string | "";
	userName?: string | "";
	role?: string;
	followers?: string[];
}

export interface UserData extends user {
	profile?: user | {};
	status?: "follow" | "following";
}
