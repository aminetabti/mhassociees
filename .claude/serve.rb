#!/usr/bin/env ruby
require 'webrick'
port = (ARGV[0] || 3456).to_i
root = File.expand_path('..', __dir__)
server = WEBrick::HTTPServer.new(Port: port, DocumentRoot: root, Logger: WEBrick::Log.new($stderr, WEBrick::Log::WARN), AccessLog: [])
trap('INT') { server.shutdown }
trap('TERM') { server.shutdown }
server.start
