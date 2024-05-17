export interface User {
	_id?: string | null;
	fullName?: string | null;
	profilePic?: string | null;
	numOfFollowers?: number;
	numOfFollowings?: number;
}

export interface Comment {
	_id?: string | null;
	comment?: string | null;
	post?: string | null;
	commentedBy?: User | null;
	numOfReplies?: number;
	replies?: Reply[];
	createdAt?: string | null;
	updatedAt?: string | null;
}

export interface Reply {
	_id?: string | null;
	reply?: string | null;
	comment?: string | null;
	replier?: User[] | null;
	createdAt?: string | null;
	updatedAt?: string | null;
}

export interface ManualLocation {
	zipCode?: string | null;
	landMark?: string | null;
	city?: string | null;
	state?: string | null;
	country?: string | null;
}

export interface GoogleLocation {
	address?: string | null;
}

export interface Post {
	_id?: string | null;
	status: string;
	content?: string[] | null;
	desc?: string | null;
	postedBy?: User;
	numOfShares?: number;
	views?: number;
	numOfLikes?: number;
	numOfComments?: number;
	comments?: Comment[];
	tagPeople?: User;
	numOfPeopleTag?: number;
	addLocation?: ManualLocation | GoogleLocation | null;
	addCategory?: string[] | null;
	addMusic?: string | null;
	products?: string[] | null;
	createdAt?: string | null;
	updatedAt?: string | null;
}

export const location: ManualLocation = {
	zipCode: "",
	landMark: "",
	city: "",
	state: "",
	country: "",
};
