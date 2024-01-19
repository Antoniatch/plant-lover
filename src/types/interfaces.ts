export interface IContextUser {
    id: string;
    name: string;
}

export interface IContext {
    user?: IContextUser;
}
