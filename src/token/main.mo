import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Debug "mo:base/Debug";
import Iter "mo:base/Iter";

actor Token {
    let owner : Principal = Principal.fromText("copil-mzrs5-zkfgx-cxinb-ihtjf-hrvxf-2xnxd-5htqm-fwj7x-lcijx-aae");
    let totalSupply : Nat = 1000000000;
    let symbol : Text = "KANG";

    private stable var balanceEntries : [(Principal, Nat)] = [];

    // Helper function to initialize the HashMap and set the owner's balance
    private func initBalances() : HashMap.HashMap<Principal, Nat> {
        let map = HashMap.HashMap<Principal, Nat>(10, Principal.equal, Principal.hash);
        map.put(owner, totalSupply);
        map;
    };

    private var balances = initBalances();

    public query func balanceOf(who : Principal) : async Nat {
        let balance : Nat = switch (balances.get(who)) {
            case (null) { 0 };
            case (?result) { result };
        };
        return balance;
    };

    public query func getSymbol() : async Text {
        return symbol;
    };

    public shared(msg) func payOut() : async Text {
        if (balances.get(msg.caller) == null) {
            let amount = 10000;
            let _result = await transfer(msg.caller, amount);
            balances.put(msg.caller, amount);
            return "Success";
        } else {
            return "Already Claimed";
        }
    };

    public shared(msg) func transfer(to : Principal, amount : Nat) : async Text {
        let fromBalance = await balanceOf(msg.caller);
        if (fromBalance > amount) {
            let newFromBalance : Nat = fromBalance - amount;
            balances.put(msg.caller, newFromBalance);
          
            let toBalance = await balanceOf(to);
            let newToBalance = toBalance + amount;

            balances.put(to, newToBalance);

            return "Success";
        } else {
            return "Insuffficient funds";
        }
    };

    system func preupgrade() {
        balanceEntries := Iter.toArray(balances.entries());
    };

    system func postupgrade() {
        balances := HashMap.fromIter<Principal, Nat>(
            Iter.fromArray(balanceEntries), 
            10, 
            Principal.equal, 
            Principal.hash
        );
        if (balances.size() < 1) {
            balances.put(owner, totalSupply);
        }
    };
};