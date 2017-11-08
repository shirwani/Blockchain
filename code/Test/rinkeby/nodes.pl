#!/usr/bin/perl
use strict;
use warnings FATAL => 'all';
use POSIX;

if(-l '/home/ubuntu/.ethereum/geth.ipc'){
    `geth attach --exec "admin.peers" > peers.json`;
}else {
    `ln -s ~/.rinkeby/geth.ipc ~/.ethereum/; geth attach --exec "admin.peers" > peers.json`;
}
my @enodes_str = `grep 'id' peers.json`;
my @remoteAddresses_str = `grep 'remoteAddress' peers.json`;

my $nodes = {};
my $now = strftime("%Y-%m-%d %H:%M:%S\n", localtime(time));
$now =~ s/\n//;

###############################################################
# If nodes.dat exists, load existing list of peers as hash keys
###############################################################
if(-e './nodes.dat'){
    open(my $fh, ' < nodes.dat');
    while (my $row = <$fh>) {
        chomp $row;
        $row =~ s/\n//;
        my @dparts = split(/\|/, $row);
        my $id = $dparts[0];
        $nodes->{$id}->{'COUNT'} = $dparts[1];
        $nodes->{$id}->{'LAST_SEEN'} = $dparts[2];
    }
}

###########################################
# Get node info from currently running geth
###########################################
my @enodes = ();
foreach my $e(@enodes_str){
    chomp $e;
    my $enode = join " ", (split /:/, $e)[1];
    $enode =~ s/\"//g;
    $enode =~ s/\,//g;
    $enode =~ s/\s//g;
    push(@enodes,$enode);
}
my $i = 0;
foreach my $r(@remoteAddresses_str){
    chomp($r);
    my @parts = split(/:/, $r);
    my $ip = "$parts[1]:$parts[2]";
    $ip =~ s/\"//g;
    $ip =~ s/\,//g;
    $ip =~ s/\s//g;
    my $id = 'enode://' . $enodes[$i] . '@' . $ip;
    $nodes->{$id}->{'COUNT'} += 1;
    $nodes->{$id}->{'LAST_SEEN'} = $now;
    $i++;
}

###########################################
# Write merged list of nodes into nodes.dat
###########################################
open(my $fh, ' > nodes.dat');
my $sz = keys %{$nodes};
print "Caching $sz nodes\n";
foreach my $id(keys %{$nodes}){
    my $count = $nodes->{$id}->{'COUNT'};
    my $last_seen = $nodes->{$id}->{'LAST_SEEN'};
    print $fh "$id|$count|$last_seen\n";
}
close $fh;

######################
# Create nodes.sh file
######################
open($fh, ' > nodes.sh');
foreach my $node(keys %{$nodes}){
    print $fh "geth attach --exec \"admin.addPeer(\\\"$node\\\")\"\n";
}
close $fh;
`chmod +x nodes.sh`;

