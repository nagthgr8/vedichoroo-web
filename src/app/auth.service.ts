import { NgZone, Injectable, EventEmitter } from '@angular/core';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { HttpClient } from '@angular/common/http';
import { User } from './user';

@Injectable()
export class AuthService {
	private authCodeFlowConfig: AuthConfig = {
    // Url of the Identity Provider
    issuer: 'https://accounts.google.com',

    tokenEndpoint: 'https://accounts.google.com/token',

    // URL of the SPA to redirect the user to after login
    redirectUri: window.location.origin + '/callback',
    loginUrl: '/login',
    // The SPA's id. The SPA is registerd with this id at the auth-server
    // clientId: 'server.code',
    clientId: '242286730499-tr8dq77hb8k2e0s55cvhh3m57cjabf1i.apps.googleusercontent.com',

    

    // Just needed if your auth server demands a secret. In general, this
    // is a sign that the auth server is not configured with SPAs in mind
    // and it might not enforce further best practices vital for security
    // such applications.
     dummyClientSecret: 'lngeqDVVH58yctoFBvf2zPo-',

    responseType: 'code',

    // set the scope for the permissions the client should request
    // The first four are defined by OIDC.
    // Important: Request offline_access to get a refresh token
    // The api scope is a usecase specific one
    scope: 'openid profile email',


    showDebugInformation: true,

    // turn off validation that discovery document endpoints start with the issuer url defined above
    // https://manfredsteyer.github.io/angular-oauth2-oidc/docs/additional-documentation/using-an-id-provider-that-fails-discovery-document-validation.html
    strictDiscoveryDocumentValidation: false,
    skipIssuerCheck: true,
    disablePKCE: false
  };   
  
    constructor(public oauthService: OAuthService, private http: HttpClient) {
    
    }
    async initialize() {
      this.oauthService.configure(this.authCodeFlowConfig);

    }
    async tryLogin(): Promise<User> {
      console.log('authService.tryLogin called');
      await this.oauthService.loadDiscoveryDocumentAndTryLogin();
      console.log('authService.tryLogin returned');
      let atok: string = this.oauthService.getAccessToken();
      console.log('atok', atok);
      if (this.oauthService.hasValidIdToken()) {
        console.log('user is authenticated');
        // User is authenticated
        const identityClaims = this.oauthService.getIdentityClaims();
        console.log('User Profile:', identityClaims);
				let user: User = {
					name: identityClaims['name'],
					email: identityClaims['email'],
					imageUrl: identityClaims['picture'],
					balance: 0,
					ccy: '',
					peerid: '',
					dob: '',
					isprivate: true
				};
        return user;
      }
      return null;
    }
    async login() {
      console.log('OAuth login called & calling initLoginFlow');
      
      try {
        await this.oauthService.initLoginFlow();
        console.log('Login flow completed');
  
        // if (this.oauthService.hasValidAccessToken()) {
        //   // User is authenticated
        //   const identityClaims = this.oauthService.getIdentityClaims();
        //   let user: User = {
        //     name: identityClaims['preferred_username'],
        //     email: identityClaims['email'],
        //     imageUrl: identityClaims['picture'],
        //     balance: 0,
        //     ccy: '',
        //     peerid: '',
        //     dob: '',
        //     isprivate: true
        //   };
        //   return user;
        // } else {
        //   console.log('Access token not available. User not logged in.');
        //   return null;
        // }
      } catch (error) {
        console.error('Login failed:', error);
        throw error; // Propagate the error to the calling code if needed
      }
    }
    async logout() {
      try {
        // Call the logOut() method from the OAuthService
        await this.oauthService.logOut();
  
        // Optionally, you can navigate to a logout page or perform additional cleanup
        // For example, if you're using Angular Router:
        // this.router.navigate(['/logout']);
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
    // handleAuthenticationCallback() {
    //     console.log('in handleAuthenticationCallback');
    //     this.oauthService.loadDiscoveryDocumentAndLogin().then(() => {
    //       // Extract tokens or user information as needed
    //       console.log('returned from loadDiscoveryAuthenticationAndLogin, getting idToken..');
    //       const idToken = this.oauthService.getIdToken();
    //       console.log('idToken',idToken);
    //       this.getUserProfile();
    //     });
    //   }
    getUserProfile() {
        console.log('in getUserProfile');
        // Make a request to the Google People API
        const accessToken = this.oauthService.getAccessToken();
        console.log('accessToken', accessToken);
        const apiUrl = 'https://people.googleapis.com/v1/people/me?personFields=names,email';
        
        this.http.get(apiUrl, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }).subscribe((profile: any) => {
          console.log('Google User Profile:', profile);
        });
      }
  }